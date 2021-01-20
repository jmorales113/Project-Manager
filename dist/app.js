"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, people) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            people: people
        };
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
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
        this.renderForm();
    }
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
    formListener() {
        this.formEl.addEventListener("submit", this.submitForm);
    }
    renderForm() {
        this.appendEl.insertAdjacentElement("afterbegin", this.formEl);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitForm", null);
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateEl = document.getElementById("project-list");
        this.appendEl = document.getElementById("app");
        this.assignedProjects = [];
        const importTemplate = document.importNode(this.templateEl.content, true);
        this.sectionEl = importTemplate.firstElementChild;
        this.sectionEl.id = `${this.type}-projects`;
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.renderProjectList();
        this.renderSection();
    }
    renderProjects() {
        const projectListEl = document.getElementById(`${this.type}-projects-list`);
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            projectListEl.appendChild(listItem);
            console.log(projectItem.title);
        }
    }
    renderSection() {
        const listId = `${this.type}-projects-list`;
        this.sectionEl.querySelector("ul").id = listId;
        this.sectionEl.querySelector("h2").textContent = `${this.type} projects`;
    }
    renderProjectList() {
        this.appendEl.insertAdjacentElement("beforeend", this.sectionEl);
    }
}
const projectManager = new ProjectInput();
const activeProjectList = new ProjectList("Active");
const finishedProjectList = new ProjectList("Finished");
//# sourceMappingURL=app.js.map