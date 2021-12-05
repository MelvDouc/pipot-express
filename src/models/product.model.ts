import { ObjectId } from "mongodb";
import Model from "../core/model.js";
import Category from "./category.model.js";

export default class Product extends Model {
  static collectionName = "products";

  public name?: string;
  public slug?: string;
  public description?: string;
  public price?: number;
  public quantity?: number;
  public seller_id?: ObjectId | string | null;
  public category_id?: ObjectId | string | null;

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

  public setCategoryId(category_id: string): void {
    try {
      this.category_id = new ObjectId(category_id);
    } catch (error) {
      console.log(error);
      this.category_id = null;
    }
  }

  public setSellerId(seller_id: string): void {
    this.seller_id = new ObjectId(seller_id);
  }

  private checkName = this.check(!this.name, "Veuillez donner un nom à l'article.");
  private checkDescription = this.check(!this.description, "Veuillez décrire l'article.");
  private checkPrice = this.check(
    !Number.isInteger(this.price) || this.price! < 0,
    "Le prix doit être un nombre entier supérieur ou égal à 0."
  );
  private checkQuantity = this.check(
    !Number.isInteger(this.quantity) || this.quantity! < 1,
    "La quantité doit être un nombre entier supérieur ou égal à 1.",
  );
  private async checkCategory(): Promise<string | null> {
    const category = await Category.findOne({ _id: this.category_id });
    return (!category) ? "Catégorie non trouvée." : null;
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
    const date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();
    this.slug = [slug, year, month, day, hours, minutes, seconds].join("-");
  }

  public async insert(): Promise<void> {
    this.saveImage();
    await this.addSlug();
    await Model.prototype.insert.call(this);
  }
}