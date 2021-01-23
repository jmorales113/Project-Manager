export interface Drag {
    dragStart(e: DragEvent): void
    dragEnd(e: DragEvent): void
}

export interface DragDrop {
    dragOver(e: DragEvent): void
    drop(e: DragEvent): void
    dragLeave(e: DragEvent): void
} 


