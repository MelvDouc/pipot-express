export default class FormSubmit extends HTMLElement {
  constructor() {
    super();
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = this.text;
    this.append(button);
  }

  get text() {
    return this.getAttribute("text") ?? "Valider";
  }
}