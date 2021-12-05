import Model from "../core/model.js";
import Product from "./product.model.js";

export default class Category extends Model {
  static collectionName = "categories";

  public name?: string;
  public description?: string;
  public slug?: string;

  constructor() {
    super();
  }

  toObjectLiteral() {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      slug: this.slug,
      added_at: this.added_at
    };
  }

  hasNoName() {
    return (!this.name) ? "Veuillez donner un nom à la catégorie." : null;
  }

  hasNoDescription() {
    return (!this.description) ? "Veuillez décrire la catégorie." : null;
  }

  hasNoSlug() {
    return (!this.slug) ? "Veuillez saisir un permalien." : null;
  }

  isSlugFormatInvalid() {
    if (!this.slug || /^\w+(\-\w+)*$/.test(this.slug))
      return null;
    return "Format de permalien invalide.";
  }

  async isNotUniqueSlug() {
    if (!this.slug)
      return null;
    const categoryWithSameSlug = await Category.findOne({ slug: this.slug });
    if (categoryWithSameSlug)
      return `Permalien déjà utilisé par la catégorie ${categoryWithSameSlug.name}`;
    return null;
  }

  async getCreationErrors() {
    let errors = [];
    errors.push(this.hasNoName());
    errors.push(this.hasNoDescription());
    errors.push(this.hasNoSlug());
    errors.push(this.isSlugFormatInvalid());
    errors.push(await this.isNotUniqueSlug());
    errors.push(this.checkImageSize());
    errors.push(this.checkImageMimetype());

    errors = errors.filter(err => err !== null);
    return errors.length ? errors : null;
  }

  async findProducts() {
    return await Product.findAll({ category_id: this._id });
  }

  async insert() {
    this.saveImage();
    await Model.prototype.insert.call(this);
  }
}