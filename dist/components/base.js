export class Component {
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
//# sourceMappingURL=base.js.map