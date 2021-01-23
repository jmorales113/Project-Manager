import { Component } from "./base"
import { autobind } from "../decorator/autobind"
import { projectState } from "../state/project-state"

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputEl: HTMLInputElement
    descriptionInputEl: HTMLInputElement
    peopleInputEl: HTMLInputElement

    constructor() {
        super("project-input", "app", true, "user-input")
        this.titleInputEl = this.sectionEl.querySelector("#title") as HTMLInputElement
        this.descriptionInputEl = this.sectionEl.querySelector("#description") as HTMLInputElement
        this.peopleInputEl = this.sectionEl.querySelector("#people") as HTMLInputElement
        
        this.renderList()
    }

        renderList() {
            this.sectionEl.addEventListener("submit", this.submitForm)
        }

        renderSection() {}

        private userInput(): [string, string, number] | void {
            const titleInput = this.titleInputEl.value
            const descriptionInput = this.descriptionInputEl.value
            const peopleInput = this.peopleInputEl.value

            if (titleInput.trim().length === 0 || descriptionInput.trim().length === 0 || peopleInput.trim().length === 0) {
                alert("Invalid input, please try again!")
                return
            } else {
                return [titleInput, descriptionInput, +peopleInput]
            }
        }

        private wipeInputFields() {
            this.titleInputEl.value = "",
            this.descriptionInputEl.value= "",
            this.peopleInputEl.value = ""
        }

        @autobind
        private submitForm(e: Event) {
            e.preventDefault()
            const inputUser = this.userInput()
            if (Array.isArray(inputUser)) {
                const [title, description, people] = inputUser
                projectState.addProject(title, description, people)
                this.wipeInputFields()
            }
        }
}
