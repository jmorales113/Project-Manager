class ProjectInput {
    templateEl: HTMLTemplateElement
    appendEl: HTMLDivElement
    formEl: HTMLFormElement
    
    constructor() {
        this.templateEl = document.getElementById("project-input")! as HTMLTemplateElement
        this.appendEl = document.getElementById("app")! as HTMLDivElement

        const importTemplate = document.importNode(this.templateEl.content, true)
        this.formEl = importTemplate.firstElementChild as HTMLFormElement
        this.appendForm()
    }
        // Create private method to render template(renderTemplate) with appendEl using insertAdjacentElement(Two arguments-"afterbegin", what am I rendering?)
        private appendForm() {
            this.appendEl.insertAdjacentElement("afterbegin", this.formEl)
        }
}

const projectManager = new ProjectInput()
