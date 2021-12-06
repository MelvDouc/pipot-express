export default class FormText extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
    <label for="${this.idPlus}">${this.labelText}</label>
    <input type="text" id="${this.idPlus}" name="${this.idPlus}" value="${this.val}" ${this.requiredAttribute} />
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