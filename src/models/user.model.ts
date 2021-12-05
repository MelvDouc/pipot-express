import bcrypt from "bcryptjs";
import { validate as isValidEmail } from "email-validator";
import Model from "../core/model.js";
import { getRandomString } from "../utils/random.js";

export default class User extends Model {
  static collectionName = "users";
  static roles = {
    ADMIN: "ADMIN",
    USER: "USER"
  };

  public username?: string;
  public email?: string;
  public password?: string;
  public role?: string;
  public verified?: string;
  public verif_string?: string;
  public plain_password?: string | null;
  public confirm_password?: string | null;

  constructor() {
    super();
    this.role = User.roles.USER;
  }

  toObjectLiteral() {
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

  private async isUsernameTaken(): Promise<string | null> {
    if (await User.findOne({ username: this.username }))
      return "Nom d'utilisateur indisponible.";
    return null;
  }

  private hasNoUsername(): string | null {
    if (!this.username)
      return "Veuillez renseigner un nom d'utilisateur.";
    return null;
  }

  private hasInvalidOuterCharacters(): string | null {
    if (this.username && !/^[a-z0-9].+[a-z0-9]$/i.test(this.username))
      return "Le nom d'utilisateur doit commencer et terminer par une lettre ou un nombre.";
    return null;
  }

  private hasInvalidInnerCharacters(): string | null {
    if (this.username && /[^\w_\-]/.test(this.username))
      return "Le nom d'utilisateur ne doit contenir que des lettres, des chiffres et/ou des tirets.";
    return null;
  }

  async isEmailTaken() {
    const userWithSameEmail = await User.findOne({ email: this.email });
    return (userWithSameEmail) ? "Un compte avec cette adresse email existe déjà." : null;
  }

  isInvalidEmail() {
    return (!isValidEmail(this.email!)) ? "Adresse email invalide" : null;
  }

  hasPlainPassword() {
    return (!this.plain_password) ? "Veuillez renseigner un mot de passe." : null;
  }

  hasConfirmPassword() {
    return (!this.confirm_password) ? "Veuillez confirmer le mot de passe." : null;
  }

  private passwordsDoNotMatch(): string | null {
    if (this.plain_password && this.confirm_password && this.confirm_password !== this.plain_password)
      return "Les mots de passe ne se correspondent pas.";
    return null;
  }

  private checkPasswordLength(): string | null {
    if (this.plain_password!.length < 8 || this.plain_password!.length > 25)
      return "Le mot de passe doit avoir une longueur entre 8 et 25 caractères.";
    return null;
  }

  isInvalidRole() {
    if (!(this.role! in User.roles))
      return "Rôle invalide.";
    return null;
  }

  public async getRegisterErrors(): Promise<string[] | null> {
    let errors = [];
    errors.push(this.hasNoUsername());
    errors.push(await this.isUsernameTaken());
    errors.push(this.hasInvalidOuterCharacters());
    errors.push(this.hasInvalidInnerCharacters());
    errors.push(await this.isEmailTaken());
    errors.push(this.isInvalidEmail());
    errors.push(this.hasPlainPassword());
    errors.push(this.hasConfirmPassword());
    errors.push(this.passwordsDoNotMatch());
    errors.push(this.checkPasswordLength());

    errors = errors.filter(err => err !== null);
    return (errors.length) ? errors as string[] : null;
  }

  public async getUpdateErrors(oldUsername: string): Promise<string[] | null> {
    let errors: (string | null)[] = [];
    if (this.username !== oldUsername)
      errors.push(await this.isUsernameTaken());
    errors.push(this.hasNoUsername());
    errors.push(this.hasInvalidOuterCharacters());
    errors.push(this.hasInvalidInnerCharacters());
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

  public async register(): Promise<void> {
    await this.hashPlainPassword();
    this.verif_string = getRandomString(128);
    await Model.prototype.insert.call(this);
  }
}