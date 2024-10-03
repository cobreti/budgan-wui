import type { CbrDraggableInterface } from "./cbrDraggableInterface";
import type { CbrHoverEnterEvent } from "./cbrDragNDropTypes";

export interface CbrDraggableControllerInterface {

    pinAreaElement: HTMLElement;
    freeAreaElement: HTMLElement;

    getPinElementFromPoint(x: number, y: number): Element | undefined;

    registerDraggable(draggable: CbrDraggableInterface): void;

    onHoverEnter(draggable: CbrDraggableInterface, event: CbrHoverEnterEvent): void;

    unpin(): void;
}


export type CbrDraggableControllerOptions = {
    pinAreaSelector: string;
    freeAreaSelector: string;
}


export class CbrDraggableController implements CbrDraggableControllerInterface {

    pinAreaSelector_: string;
    freeAreaSelector_: string;
    draggable_: CbrDraggableInterface | undefined;

    constructor(options: CbrDraggableControllerOptions) {
        this.pinAreaSelector_ = options.pinAreaSelector;
        this.freeAreaSelector_ = options.freeAreaSelector;
    }

    get pinAreaElement(): HTMLElement {
        return document.querySelector(this.pinAreaSelector_) as HTMLElement;
    }

    get freeAreaElement(): HTMLElement {
        return document.querySelector(this.freeAreaSelector_) as HTMLElement;
    }

    getPinElementFromPoint(x: number, y: number): Element | undefined {
        if (this.pinAreaSelector_ === '') {
          return undefined
        }
    
        let elements: Element[] | null = null
        let dropArea : Element | undefined = undefined;
    
        elements = document.elementsFromPoint(x, y);

        dropArea = elements.find((element) => {
        return element.matches(this.pinAreaSelector_)
        })
    
        return dropArea;
    }

    onHoverEnter(draggable: CbrDraggableInterface, event: CbrHoverEnterEvent): void {
    }

    unpin(): void {
        if (this.draggable_) {
            this.draggable_.unpin();
        }
    }

    registerDraggable(draggable: CbrDraggableInterface): void {
        this.draggable_ = draggable;
    }
}
