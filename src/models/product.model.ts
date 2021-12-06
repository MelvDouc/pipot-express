import { ObjectId } from "mongodb";
import Model from "../core/model.js";
import Category from "./category.model.js";
import PipotDate from "../utils/date.js";

export default class Product extends Model {
  static collectionName = "products";

  public name: string = "";
  public slug: string = "";
  public description?: string = "";
  public price: number = NaN;
  public quantity: number = NaN;
  public seller_id: ObjectId | string | null = null;
  public category_id: ObjectId | string | null = null;

  constructor() {
    super();
  }

  toObjectLiteral() {
    return {
      _id: this._id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      price: this.price,
      quantity: this.quantity,
      seller_id: this.seller_id,
      category_id: this.category_id,
      image: this.image,
      added_at: this.added_at
    };
  }

  public setCategoryId(category_id: string): Product {
    try {
      this.category_id = new ObjectId(category_id);
    } catch (error) {
      console.log(error);
      this.category_id = null;
    } finally {
      return this;
    }
  }

  public setSellerId(seller_id: string): Product {
    this.seller_id = new ObjectId(seller_id);
    return this;
  }

  private checkName() {
    return this.check(() => Boolean(this.name) === true, "Veuillez donner un nom à l'article.");
  }

  private checkDescription() {
    return this.check(() => Boolean(this.description) === true, "Veuillez décrire l'article.");
  }

  private checkPrice() {
    return this.check(
      () => Number.isInteger(this.price) && this.price >= 0,
      "Le prix doit être un nombre entier supérieur ou égal à 0."
    );
  }

  private checkQuantity() {
    return this.check(
      () => Number.isInteger(this.quantity) && this.quantity >= 1,
      "La quantité doit être un nombre entier supérieur ou égal à 1.",
    );
  }

  private async checkCategory(): Promise<string | null> {
    const message = "Catégorie non trouvée.";
    try {
      const category = await Category.findOne({ _id: this.category_id });
      return (!category) ? message : null;
    } catch (_e) {
      return message;
    }
  }

  public async getCreationErrors(): Promise<string[] | null> {
    let errors = [] as (string | null)[];
    errors.push(this.checkName());
    errors.push(this.checkDescription());
    errors.push(this.checkPrice());
    errors.push(this.checkQuantity());
    errors.push(await this.checkCategory());
    errors.push(this.checkImageSize());
    errors.push(this.checkImageMimetype());

    errors = errors.filter(err => err !== null);
    return (errors.length) ? errors as string[] : null;
  }

  private async addSlug(): Promise<void> {
    if (!this.name)
      throw new Error(`Product is missing a name.`);

    const slug = this.name.replace(/\s+/g, "-");
    const productsWithSameSlug = await Product.findAll({ slug });
    if (!productsWithSameSlug.length) {
      this.slug = slug;
      return;
    }
    this.slug = `${this.slug}-${new PipotDate().getKebabDateTime()}`;
  }

  public async insert(): Promise<void> {
    this.saveImage();
    await this.addSlug();
    await Model.prototype.insert.call(this);
  }
}