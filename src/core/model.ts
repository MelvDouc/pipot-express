import { UploadedFile } from "express-fileupload";
import { ObjectId } from "mongodb";
import database from "./database.js";
import { join as pathJoin } from "path";
import uniqueFileName from "unique-filename";

interface IModel {
  new(): Model;
  name: string;
  readonly collectionName: string;
}

export default abstract class Model {
  static readonly collectionName: string;
  static allowedMimetypes = ["image/jpeg", "image/png", "image/gif"];

  static createFromEntity(entity: any) {
    const instance = new (this.prototype.constructor as any)();
    for (const key in entity)
      instance[key] = entity[key];
    return instance;
  }

  static async findOne(filter: object) {
    const entity = await database.getOne(this.collectionName, filter);
    if (!entity)
      return null;
    return this.createFromEntity(entity);
  }

  static async findById(id: string) {
    try {
      return this.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      return null;
    }
  }

  static async findAll(filter = {}) {
    const entities = await database.getAll(this.collectionName, filter);
    return entities.map(this.createFromEntity, this.prototype.constructor);
  }

  public _id: ObjectId | null = null;
  added_at: Date;
  image?: UploadedFile | string | null;

  constructor() {
    this.added_at = new Date();
  }

  protected get constr() {
    return this.constructor as IModel;
  }

  protected get imageExtension() {
    if (!this.image || typeof this.image === "string")
      return null;
    return this.image.name.match(/\.\w+$/g);
  }

  protected check(wrongCondition: boolean, message: string) {
    return () => {
      return (wrongCondition) ? message : null;
    };
  }

  protected checkImageSize(): string | null {
    if (!this.image || typeof this.image === "string")
      return null;

    if (this.image?.size > 2e6)
      return "Fichier trop volumineux. 2 MB maximum.";
    return null;
  }

  protected checkImageMimetype(): string | null {
    if (!this.image || typeof this.image === "string")
      return null;

    if (!Model.allowedMimetypes.includes(this.image.mimetype))
      return "Seules les images au format jpg, png ou gif sont autorisées.";
    return null;
  }

  protected saveImage(): void {
    if (!this.image || typeof this.image === "string") {
      this.image = "default.jpg";
      return;
    }

    const imgFolder = pathJoin(process.cwd(), "static", "img", this.constr.collectionName);
    const absolutePath = uniqueFileName(imgFolder) + this.imageExtension;
    this.image.mv(absolutePath, (err) => {
      if (err) throw err;
    });
    this.image = absolutePath.split("\\").at(-1);
  }

  public abstract toObjectLiteral(): { [key: string]: any; };

  public async insert(): Promise<void> {
    await database.insert(this.constr.collectionName, this.toObjectLiteral());
  }

  public async update(): Promise<void> {
    await database.update(
      this.constr.collectionName,
      { _id: this._id },
      this.toObjectLiteral()
    );
  }

  public async delete(): Promise<void> {
    if (!this._id)
      throw Error(`Object is missing an _id.`);

    await database.delete(this.constr.collectionName, this._id);
  }
}