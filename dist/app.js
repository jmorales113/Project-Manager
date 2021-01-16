"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const autobind = (_, _2, descriptor) => {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        }
    };
    return adjustedDescriptor;
};
class ProjectInput {
    constructor() {
        this.templateEl = document.getElementById("project-input");
        this.appendEl = document.getElementById("app");
        const importTemplate = document.importNode(this.templateEl.content, true);
        this.formEl = importTemplate.firstElementChild;
        this.titleInputEl = this.formEl.querySelector("#title");
        this.descriptionInputEl = this.formEl.querySelector("#description");
        this.peopleInputEl = this.formEl.querySelector("#people");
        this.formListener();
        this.appendForm();
    }
    submitForm(e) {
        e.preventDefault();
        console.log(this.titleInputEl.value);
        console.log(this.descriptionInputEl.value);
        console.log(this.peopleInputEl.value);
    }
    formListener() {
        this.formEl.addEventListener("submit", this.submitForm);
    }
    appendForm() {
        this.appendEl.insertAdjacentElement("afterbegin", this.formEl);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitForm", null);
const projectManager = new ProjectInput();
//# sourceMappingURL=app.js.map