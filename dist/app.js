"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
class ProjectState extends State {
    constructor() {
        super();
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addProject(title, description, people) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
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
class Component {
    constructor(templateId, appendElId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.appendEl = document.getElementById(appendElId);
        const importTemplate = document.importNode(this.templateEl.content, true);
        this.sectionEl = importTemplate.firstElementChild;
        if (newElementId) {
            this.sectionEl.id = newElementId;
        }
        this.renderProjectList(insertAtStart);
    }
    renderProjectList(insertAtStart) {
        this.appendEl.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.sectionEl);
    }
}
class ProjectInput extends Component {
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
class ProjectItem extends Component {
    constructor(templateId, project) {
        super("single-project", templateId, false, project.id);
        this.project = project;
        this.renderList();
        this.renderSection();
    }
    get members() {
        if (this.project.people === 1) {
            return "1 member";
        }
        else {
            return `${this.project.people} members`;
        }
    }
    dragStart(e) {
        console.log(e);
    }
    dragEnd(_) {
        console.log("DragEnd");
    }
    renderList() {
        this.sectionEl.addEventListener("dragstart", this.dragStart);
        this.sectionEl.addEventListener("dragend", this.dragEnd);
    }
    renderSection() {
        this.sectionEl.querySelector("h2").textContent = this.project.title;
        this.sectionEl.querySelector("h3").textContent = this.members;
        this.sectionEl.querySelector("p").textContent = this.project.description;
    }
}
__decorate([
    autobind
], ProjectItem.prototype, "dragStart", null);
class ProjectList extends Component {
    constructor(type) {
        super("project-list", "app", false, `${type}-projects`);
        this.type = type;
        this.assignedProjects = [];
        this.renderList();
        this.renderSection();
    }
    renderList() {
        projectState.addListener((projects) => {
            const filteredProjects = projects.filter((project) => {
                if (this.type === "Active") {
                    return project.status === ProjectStatus.Active;
                }
                else {
                    return project.status === ProjectStatus.Finished;
                }
            });
            this.assignedProjects = filteredProjects;
            this.renderProjects();
        });
    }
    renderSection() {
        const listId = `${this.type}-projects-list`;
        this.sectionEl.querySelector("ul").id = listId;
        this.sectionEl.querySelector("h2").textContent = `${this.type} Projects`;
    }
    renderProjects() {
        const projectListEl = document.getElementById(`${this.type}-projects-list`);
        projectListEl.innerHTML = "";
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.sectionEl.querySelector("ul").id, projectItem);
        }
    }
}
const projectManager = new ProjectInput();
const activeProjectList = new ProjectList("Active");
const finishedProjectList = new ProjectList("Finished");
//# sourceMappingURL=app.js.map