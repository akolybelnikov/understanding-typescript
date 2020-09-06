import { autobind } from '../decorators/autobind'
import { Draggable } from '../models/drag-drop'
import { Project } from '../models/project'
import Component from './base'

// ProjectItem Class
export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
    private project: Project

    get persons() {
        return this.project.people > 1
            ? `Team of ${this.project.people} people`
            : `Team of 1 person`
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id)
        this.project = project
        this.configure()
        this.renderContent()
    }

    @autobind
    dragStartHandler(e: DragEvent) {
        e.dataTransfer!.setData('text/plain', this.project.id)
        e.dataTransfer!.effectAllowed = 'move'
    }

    dragEndHandler(_: DragEvent) {
        //console.log('DragEnd')
    }

    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.persons
        this.element.querySelector('p')!.textContent = this.project.description
    }
}
