import bcrypt from "bcryptjs";
import { validate as isValidEmail } from "email-validator";
import Model from "../core/model.js";
import { getRandomString } from "../utils/random.js";
import Product from "./product.model.js";

export default class User extends Model {
  static collectionName = "users";
  static roles = {
    ADMIN: "ADMIN",
    USER: "USER"
  };

  public username: string;
  public email: string;
  public password: string;
  public role: string;
  public verified: string;
  public verif_string: string;
  public plain_password?: string | null;
  public confirm_password?: string | null;

  constructor() {
    super();
    this.role = User.roles.USER;
  }

  public toObjectLiteral() {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      verified: this.verified,
      verif_string: this.verif_string,
      added_at: this.added_at,
    };
  }

  public deletePasswords(): User {
    this.password = "";
    delete this.plain_password;
    delete this.confirm_password;
    return this;
  }

  private async isUsernameTaken(): Promise<string | null> {
    if (await User.findOne({ username: this.username }))
      return "Nom d'utilisateur indisponible.";
    return null;
  }

  private checkUsername(): string | null {
    const check1 = this.check(() => Boolean(this.username), "Veuillez renseigner un nom d'utilisateur.");
    if (check1) return check1;

    const check2 = this.check(() => {
      return /^[a-z0-9].+[a-z0-9]$/i.test(this.username);
    }, "Le nom d'utilisateur doit commencer et terminer par une lettre ou un nombre.");
    if (check2) return check2;

    const check3 = this.check(() => {
      return !/[^\w_\-]/.test(this.username);
    }, "Le nom d'utilisateur ne doit contenir que des lettres, des chiffres et/ou des tirets.");
    return check3;
  }

  async isEmailTaken() {
    const userWithSameEmail = await User.findOne({ email: this.email });
    return (userWithSameEmail) ? "Un compte avec cette adresse email existe déjà." : null;
  }

  checkEmail() {
    return this.check(() => isValidEmail(this.email!), "Adresse email invalide");
  }

  hasPlainPassword() {
    return this.check(() => Boolean(this.plain_password), "Veuillez renseigner un mot de passe.");
  }

  hasConfirmPassword() {
    return this.check(() => Boolean(this.confirm_password), "Veuillez confirmer le mot de passe.");
  }

  private checkPasswordsMatch(): string | null {
    return this.check(() => {
      return !this.plain_password || !this.confirm_password || this.plain_password === this.confirm_password;
    }, "Les mots de passe ne se correspondent pas.");
  }

  private checkPasswordLength(): string | null {
    return this.check(() => {
      const length = this.plain_password?.length ?? 0;
      return length >= 8 && length <= 25;
    }, "Le mot de passe doit avoir une longueur entre 8 et 25 caractères.");
  }

  isInvalidRole() {
    return this.check(() => this.role! in User.roles, "Rôle invalide");
  }

  public async getRegisterErrors(): Promise<string[] | null> {
    let errors = [];
    errors.push(this.checkUsername());
    errors.push(await this.isUsernameTaken());
    errors.push(await this.isEmailTaken());
    errors.push(this.checkEmail());
    errors.push(this.hasPlainPassword());
    errors.push(this.hasConfirmPassword());
    errors.push(this.checkPasswordsMatch());
    errors.push(this.checkPasswordLength());

    errors = errors.filter(err => err !== null);
    return (errors.length) ? errors as string[] : null;
  }

  public async getUpdateErrors(oldUsername: string): Promise<string[] | null> {
    let errors: (string | null)[] = [];
    if (this.username !== oldUsername)
      errors.push(await this.isUsernameTaken());
    errors.push(this.checkUsername());
    errors.push(this.isInvalidRole());

    errors = errors.filter(err => err !== null);
    return (errors.length) ? errors as string[] : null;
  }

  // if this.#password is plainPassword, hash it
  private async hashPlainPassword(): Promise<void> {
    if (!this.plain_password)
      throw Error(`plain_password not set.`);

    this.password = this.plain_password;
    this.plain_password = null;
    this.confirm_password = null;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }

  public async checkPassword(): Promise<boolean> {
    if (!this.password)
      throw Error(`password not set.`);

    if (!this.plain_password)
      throw Error(`plain_password not set.`);

    return await bcrypt.compare(this.plain_password, this.password);
  }

  public isAdmin(): boolean {
    return this.role === User.roles.ADMIN;
  }

  public async getProducts(): Promise<Product[] | null> {
    const products = await Product.findAll({ seller_id: this._id });
    return (products.length) ? products : null;
  }

  public async register() {
    await this.hashPlainPassword();
    this.verif_string = getRandomString(128);
    return await super.insert();
  }
}