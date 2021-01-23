import { DragDrop } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js"
import { Component } from "./base.js";
import { autobind } from "../decorator/autobind.js"
import { projectState } from "../state/project-state.js"
import { ProjectItem } from "./project-item.js"

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragDrop {
    assignedProjects: Project[]

    constructor(private type: "Active" | "Finished") {
        super("project-list", "app", false, `${type}-projects`)
        this.assignedProjects = []

        this.renderList()
        this.renderSection()
    }

    @autobind
    dragOver(e: DragEvent) {
        if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
            e.preventDefault()
            const ulEl = this.sectionEl.querySelector("ul")!
            ulEl.classList.add("drop")
        }
    }

    @autobind
    drop(e: DragEvent) {
        const projectId = e.dataTransfer!.getData("text/plain")
        projectState.moveProject(projectId, this.type === "Active" ? ProjectStatus.Active : ProjectStatus.Finished)
    }

    @autobind
    dragLeave(_: DragEvent) {
        const ulEl = this.sectionEl.querySelector("ul")!
        ulEl.classList.remove("drop")
    }

    renderList() {
        this.sectionEl.addEventListener("dragover", this.dragOver)
        this.sectionEl.addEventListener("dragleave", this.dragLeave)
        this.sectionEl.addEventListener("drop", this.drop)
        projectState.addListener((projects: Project[]) => {
            const filteredProjects = projects.filter((project) => {
                if (this.type === "Active") {
                    return project.status === ProjectStatus.Active
                } else {
                    return project.status === ProjectStatus.Finished
                }
            })
            this.assignedProjects = filteredProjects
            this.renderProjects()
        })
    }

    renderSection() {
        const listId = `${this.type}-projects-list`
        this.sectionEl.querySelector("ul")!.id = listId
        this.sectionEl.querySelector("h2")!.textContent = `${this.type} Projects`
    }

    private renderProjects() {
        const projectListEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        projectListEl.innerHTML = ""
        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.sectionEl.querySelector("ul")!.id, projectItem)
        }
    }
}
