export default class DeleteUserForm extends HTMLFormElement {
  constructor() {
    super();

    this.method = "POST";
    const userId = this.getAttribute("data-user-id");
    this.action = `/admin/utilisateurs/supprimer/${userId}?_method=DELETE`;
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Supprimer";
    this.append(submitButton);
    this.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
    const confirmDeletion = confirm(`Êtes-vous sûr(e) de vouloir définitivement supprimer cet utilisateur ?`);
    if (!confirmDeletion)
      return;
    this.submit();
  }
}