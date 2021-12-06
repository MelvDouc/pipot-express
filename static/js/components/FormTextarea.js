export default class FormTextarea extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <label for="${this.idPlus}">${this.labelText}</label>
    <textarea id="${this.idPlus}" name="${this.idPlus}" ${this.requiredAttribute}>${this.val}</textarea>
    `;
  }

  get idPlus() {
    return this.getAttribute("id-plus");
  }

  get labelText() {
    return this.getAttribute("label-text");
  }

  get val() {
    return this.getAttribute("val") ?? "";
  }

  get requiredAttribute() {
    return (this.hasAttribute("is-required")) ? "required=''" : "";
  }
}