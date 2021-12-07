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

  private checkName() {
    return this.check(() => Boolean(this.name), "Veuillez donner un nom à la catégorie.");
  }

  checkDescription() {
    return this.check(() => Boolean(this.description), "Veuillez décrire la catégorie.");
  }

  checkSlug() {
    return this.check(() => {
      return this.slug && /^[a-z0-9]+(\-[a-z0-9]+)*$/i.test(this.slug);
    },
      "Veuillez saisir un permalien ne contenant que des lettres et des chiffres optionellement reliés par des traits d'union."
    );
  }

  async isNotUniqueSlug() {
    if (!this.slug)
      return null;
    const categoryWithSameSlug = await Category.findOne({ slug: this.slug });
    if (categoryWithSameSlug)
      return `Permalien déjà utilisé par la catégorie ${categoryWithSameSlug.name}`;
    return null;
  }

  public async getCreationErrors() {
    let errors = [];
    errors.push(this.checkName());
    errors.push(this.checkDescription());
    errors.push(this.checkSlug());
    errors.push(await this.isNotUniqueSlug());
    errors.push(this.checkImageSize());
    errors.push(this.checkImageMimetype());

    errors = errors.filter(err => err !== null);
    return errors.length ? errors as string[] : null;
  }

  async findProducts() {
    return await Product.findAll({ category_id: this._id });
  }

  async insert() {
    this.saveImage();
    return await super.insert();
  }
}