enum ProjectStatus { Active, Finished }

class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus) {
    }
}

type Listener<T> = (items: T[]) => void

class State<T> {
    protected listeners: Listener<T>[] = []

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn)
    }
}

class ProjectState extends State<Project> {
    private projects: Project[] =  []
    private static instance: ProjectState

    private constructor() {
        super()
    }

    static getInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new ProjectState()
        return this.instance
    }

    addProject(title: string, description: string, people: number) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active)
        this.projects.push(newProject)
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice())
        }
    }
}

const projectState = ProjectState.getInstance()


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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    
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

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[]

    constructor(private type: "Active" | "Finished") {
        super("project-list", "app", false, `${type}-projects`)
        this.assignedProjects = []

        this.renderList()
        this.renderSection()
    }

    renderList() {
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
        this.sectionEl.querySelector("h2")!.textContent = `${this.type} projects`
    }

    private renderProjects() {
        const projectListEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement
        projectListEl.innerHTML = ""
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li")
            listItem.textContent = projectItem.title
            projectListEl.appendChild(listItem)
        }
    }
}

const projectManager = new ProjectInput()
const activeProjectList = new ProjectList("Active")
const finishedProjectList = new ProjectList("Finished")





