export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement
    appendEl: T
    sectionEl: U

    constructor(templateId: string, appendElId: string, insertAtStart: boolean, newElementId?: string) {
        this.templateEl = document.getElementById(templateId)! as HTMLTemplateElement
        this.appendEl = document.getElementById(appendElId)! as T

        const importTemplate = document.importNode(this.templateEl.content, true)
        this.sectionEl = importTemplate.firstElementChild as U
        if (newElementId) {
            this.sectionEl.id = newElementId
        }

        this.renderProjectList(insertAtStart)
    }

        private renderProjectList(insertAtStart: boolean) {
            this.appendEl.insertAdjacentElement(insertAtStart ? "afterbegin" : "beforeend", this.sectionEl)
        }
        abstract renderList(): void
        abstract renderSection(): void
}
