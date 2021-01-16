"use strict";
class ProjectInput {
    constructor() {
        this.templateEl = document.getElementById("project-input");
        this.appendEl = document.getElementById("app");
        const importTemplate = document.importNode(this.templateEl.content, true);
        this.formEl = importTemplate.firstElementChild;
        this.appendForm();
    }
    appendForm() {
        this.appendEl.insertAdjacentElement("afterbegin", this.formEl);
    }
}
const projectManager = new ProjectInput();
//# sourceMappingURL=app.js.map