import { join as pathJoin } from "path";
import { UploadedFile } from "express-fileupload";
import { ObjectId } from "mongodb";
import database from "./database.js";
import { uniqueFileName } from "../utils/file-name.js";

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
    const entity = await database.findOne(this.collectionName, filter);
    if (!entity)
      return null;
    return this.createFromEntity(entity);
  }

  static async findById(id: string) {
    try {
      return this.findOne({ _id: new ObjectId(id) });
    } catch (_e) {
      return null;
    }
  }

  static async findAll(filter = {}) {
    const entities = await database.findAll(this.collectionName, filter);
    return entities.map(this.createFromEntity, this.prototype.constructor);
  }

  public _id: ObjectId;
  public readonly added_at: Date;
  public imageFile?: UploadedFile | null;
  public image?: string | null;

  constructor() {
    this._id;
    this.imageFile = null;
    this.image = null;
    this.added_at = new Date();
  }

  protected get constr() {
    return this.constructor as IModel;
  }

  protected get imageExtension() {
    return this.imageFile?.name.match(/\.\w+$/g) ?? null;
  }

  protected check(booleanFunction: Function, message: string) {
    return (!booleanFunction()) ? message : null;
  }

  protected checkImageSize(): string | null {
    if (!this.imageFile)
      return null;

    if (this.imageFile.size > 2e6)
      return "Fichier trop volumineux. 2 MB maximum.";
    return null;
  }

  protected checkImageMimetype(): string | null {
    if (!this.imageFile)
      return null;

    if (!Model.allowedMimetypes.includes(this.imageFile.mimetype))
      return "Seules les images au format jpg, jpeg, png ou gif sont autorisées.";
    return null;
  }

  protected saveImage(): void {
    if (!this.imageFile) {
      this.image = "default.jpg";
      return;
    }

    const imgFolder = pathJoin(process.cwd(), "static", "img", this.constr.collectionName);
    const fileName = uniqueFileName(imgFolder) + this.imageExtension;
    this.imageFile.mv(pathJoin(imgFolder, fileName), (err) => {
      if (err) throw err;
    });
    this.image = fileName;
  }

  public abstract toObjectLiteral(): { [key: string]: any; };

  public async insert() {
    return await database.insert(this.constr.collectionName, this.toObjectLiteral());
  }

  public async update(updates = {}) {
    return await database.update(
      this.constr.collectionName,
      { _id: this._id },
      updates
    );
  }

  public async delete() {
    if (!this._id)
      throw Error(`Object is missing an _id.`);

    return await database.delete(this.constr.collectionName, this._id);
  }
}