var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base.js";
import { autobind } from "../decorator/autobind.js";
export class ProjectItem extends Component {
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
    autobind
], ProjectItem.prototype, "dragStart", null);
//# sourceMappingURL=project-item.js.map