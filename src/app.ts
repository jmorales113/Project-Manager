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
                console.log(title, description, people)
            }
            this.wipeInputFields()
        }

        private formListener() {
            this.formEl.addEventListener("submit", this.submitForm)
        }

        private appendForm() {
            this.appendEl.insertAdjacentElement("afterbegin", this.formEl)
        }
}

class ProjectList {
    templateEl: HTMLTemplateElement
    appendEl: HTMLDivElement
    sectionEl: HTMLElement

    constructor(private type: "active" | "finished") {
        this.templateEl = document.getElementById("project-list")! as HTMLTemplateElement
        this.appendEl = document.getElementById("app")! as HTMLDivElement

        const importTemplate = document.importNode(this.templateEl.content, true)
        this.sectionEl = importTemplate.firstElementChild as HTMLElement
        this.sectionEl.id = `${this.type}-projects`
    }
}

const projectManager = new ProjectInput()




