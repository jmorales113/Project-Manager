import{ Drag } from "../models/drag-drop.js"
import { Project } from "../models/project.js"
import { Component } from "./base.js"
import { autobind } from "../decorator/autobind.js"

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Drag {
    private project: Project

    get members() {
        if (this.project.people === 1) {
            return "1 member"
        } else {
            return `${this.project.people} members`
        }
    }

    constructor(templateId: string, project: Project) {
        super("single-project", templateId, false, project.id)
        this.project = project

        this.renderList()
        this.renderSection()
    }

    @autobind
    dragStart(e: DragEvent) {
        e.dataTransfer!.setData("text/plain", this.project.id)
        e.dataTransfer!.effectAllowed = "move"
    }

    dragEnd(_: DragEvent) {
        console.log("DragEnd")
    }

    renderList() {
        this.sectionEl.addEventListener("dragstart", this.dragStart)
        this.sectionEl.addEventListener("dragend", this.dragEnd)
    }

    renderSection() {
        this.sectionEl.querySelector("h2")!.textContent = this.project.title
        this.sectionEl.querySelector("h3")!.textContent = this.members
        this.sectionEl.querySelector("p")!.textContent = this.project.description
    }
}
