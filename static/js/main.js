import DeleteUserForm from "./components/DeleteUserForm.js";
import FormText from "./components/FormText.js";
import FormTextarea from "./components/FormTextarea.js";
import FormSubmit from "./components/FormSubmit.js";

customElements.define("delete-user-form", DeleteUserForm, { extends: "form" });
customElements.define("form-text", FormText);
customElements.define("form-textarea", FormTextarea);
customElements.define("form-submit", FormSubmit);