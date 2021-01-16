// autobind decorator

const autobind = (_: any, _2: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this)
            return boundFunction
        }
    }
    return adjustedDescriptor
}

class ProjectInput {
        templateEl: HTMLTemplateElement
        appendEl: HTMLDivElement
        formEl: HTMLFormElement
        titleInputEl: HTMLInputElement
        descriptionInputEl: HTMLInputElement
        peopleInputEl: HTMLInputElement
    
    constructor() {
        this.templateEl = document.getElementById("project-input")! as HTMLTemplateElement
        this.appendEl = document.getElementById("app")! as HTMLDivElement

        const importTemplate = document.importNode(this.templateEl.content, true)
        this.formEl = importTemplate.firstElementChild as HTMLFormElement
        
        this.titleInputEl = this.formEl.querySelector("#title") as HTMLInputElement
        this.descriptionInputEl = this.formEl.querySelector("#description") as HTMLInputElement
        this.peopleInputEl = this.formEl.querySelector("#people") as HTMLInputElement

        this.formListener()
        this.appendForm()
    }
        @autobind
        private submitForm(e: Event) {
            e.preventDefault()
            console.log(this.titleInputEl.value)
            console.log(this.descriptionInputEl.value)
            console.log(this.peopleInputEl.value)
        }

        private formListener() {
            this.formEl.addEventListener("submit", this.submitForm)
        }

        private appendForm() {
            this.appendEl.insertAdjacentElement("afterbegin", this.formEl)
        }
}

const projectManager = new ProjectInput()
