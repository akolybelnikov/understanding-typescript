// import { fromEvent, Observable, timer } from 'rxjs'
// import { debounce } from 'rxjs/operators'
import { autobind } from '../decorators/autobind'
import { DragTarget } from '../models/drag-drop'
import { Project, ProjectStatus } from '../models/project'
import { projectState } from '../state/project'
import Component from './base'
import { ProjectItem } from './project-item'

// ProjectList Class
export class ProjectList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
    assignedProjects: Project[]
    // dragover$: Observable<Event> = fromEvent(this.element, 'dragover')

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = []
        this.configure()
        this.renderContent()
        // this.dragover$
        //     .pipe(debounce(() => timer(250)))
        //     .subscribe((e) => console.log(e))
    }

    @autobind
    dragOverHandler(e: DragEvent) {
        if (e.dataTransfer && e.dataTransfer.types[0] == 'text/plain') {
            e.preventDefault()
            const listEl = this.element.querySelector('ul')!
            listEl.classList.add('droppable')
        }
    }

    @autobind
    dropHandler(e: DragEvent) {
        const prjId = e.dataTransfer!.getData('text/plain')
        projectState.moveProject(
            prjId,
            this.type === 'active'
                ? ProjectStatus.Active
                : ProjectStatus.Finished
        )
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('ul')!
        listEl.classList.remove('droppable')
    }

    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('drop', this.dropHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter((prj) =>
                this.type === 'active'
                    ? prj.status === ProjectStatus.Active
                    : prj.status === ProjectStatus.Finished
            )
            this.assignedProjects = relevantProjects
            this.renderProjects()
        })
    }

    renderContent() {
        const listId = `${this.type}-projects-list`
        this.element.querySelector('ul')!.id = listId
        this.element.querySelector('h2')!.textContent =
            this.type.toUpperCase() + ' PROJECTS'
    }

    private renderProjects() {
        const listElm = this.element.querySelector('ul')!
        listElm.innerHTML = ''
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(listElm.id, prjItem)
        }
    }
}
