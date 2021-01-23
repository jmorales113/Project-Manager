var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base.js";
import { autobind } from "../decorator/autobind.js";
import { projectState } from "../state/project-state.js";
export class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInputEl = this.sectionEl.querySelector("#title");
        this.descriptionInputEl = this.sectionEl.querySelector("#description");
        this.peopleInputEl = this.sectionEl.querySelector("#people");
        this.renderList();
    }
    renderList() {
        this.sectionEl.addEventListener("submit", this.submitForm);
    }
    renderSection() { }
    userInput() {
        const titleInput = this.titleInputEl.value;
        const descriptionInput = this.descriptionInputEl.value;
        const peopleInput = this.peopleInputEl.value;
        if (titleInput.trim().length === 0 || descriptionInput.trim().length === 0 || peopleInput.trim().length === 0) {
            alert("Invalid input, please try again!");
            return;
        }
        else {
            return [titleInput, descriptionInput, +peopleInput];
        }
    }
    wipeInputFields() {
        this.titleInputEl.value = "",
            this.descriptionInputEl.value = "",
            this.peopleInputEl.value = "";
    }
    submitForm(e) {
        e.preventDefault();
        const inputUser = this.userInput();
        if (Array.isArray(inputUser)) {
            const [title, description, people] = inputUser;
            projectState.addProject(title, description, people);
            this.wipeInputFields();
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitForm", null);
//# sourceMappingURL=project-input.js.map