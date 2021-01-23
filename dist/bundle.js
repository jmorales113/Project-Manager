var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("components/base", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
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
    exports.Component = Component;
});
define("decorator/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autobind = void 0;
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
    exports.autobind = autobind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = exports.ProjectStatus || (exports.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
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
            const newProject = new project_js_1.Project(Math.random().toString(), title, description, people, project_js_1.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, status) {
            const project = this.projects.find((project) => project.id === projectId);
            if (project && project.status !== status) {
                project.status = status;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("components/project-input", ["require", "exports", "components/base", "decorator/autobind", "state/project-state"], function (require, exports, base_js_1, autobind_js_1, project_state_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_js_1.Component {
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
                project_state_js_1.projectState.addProject(title, description, people);
                this.wipeInputFields();
            }
        }
    }
    __decorate([
        autobind_js_1.autobind
    ], ProjectInput.prototype, "submitForm", null);
    exports.ProjectInput = ProjectInput;
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "components/base", "decorator/autobind"], function (require, exports, base_js_2, autobind_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_js_2.Component {
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
            e.dataTransfer.setData("text/plain", this.project.id);
            e.dataTransfer.effectAllowed = "move";
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
        autobind_js_2.autobind
    ], ProjectItem.prototype, "dragStart", null);
    exports.ProjectItem = ProjectItem;
});
define("components/project-list", ["require", "exports", "models/project", "components/base", "decorator/autobind", "state/project-state", "components/project-item"], function (require, exports, project_js_2, base_js_3, autobind_js_3, project_state_js_2, project_item_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_js_3.Component {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.renderList();
            this.renderSection();
        }
        dragOver(e) {
            if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
                e.preventDefault();
                const ulEl = this.sectionEl.querySelector("ul");
                ulEl.classList.add("drop");
            }
        }
        drop(e) {
            const projectId = e.dataTransfer.getData("text/plain");
            project_state_js_2.projectState.moveProject(projectId, this.type === "Active" ? project_js_2.ProjectStatus.Active : project_js_2.ProjectStatus.Finished);
        }
        dragLeave(_) {
            const ulEl = this.sectionEl.querySelector("ul");
            ulEl.classList.remove("drop");
        }
        renderList() {
            this.sectionEl.addEventListener("dragover", this.dragOver);
            this.sectionEl.addEventListener("dragleave", this.dragLeave);
            this.sectionEl.addEventListener("drop", this.drop);
            project_state_js_2.projectState.addListener((projects) => {
                const filteredProjects = projects.filter((project) => {
                    if (this.type === "Active") {
                        return project.status === project_js_2.ProjectStatus.Active;
                    }
                    else {
                        return project.status === project_js_2.ProjectStatus.Finished;
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
                new project_item_js_1.ProjectItem(this.sectionEl.querySelector("ul").id, projectItem);
            }
        }
    }
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragOver", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "drop", null);
    __decorate([
        autobind_js_3.autobind
    ], ProjectList.prototype, "dragLeave", null);
    exports.ProjectList = ProjectList;
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new project_input_js_1.ProjectInput();
    new project_list_js_1.ProjectList("Active");
    new project_list_js_1.ProjectList("Finished");
});
//# sourceMappingURL=bundle.js.map