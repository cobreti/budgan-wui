export type CbrHoverEnterEvent = {
  element: Element,
  preventDrop: () => void
};

export type CbrHoverExitEvent = {
  element: Element
};

export type CbrDropEvent = {
  element: Element,
  preventDefault: () => void
};

export enum CbrDraggableStateEnum {
  FREE = 'free',
  DRAGGING = 'dragging',
  PINNED = 'pinned'
};

export type CbrDraggableState = {
  state: CbrDraggableStateEnum,
  pinnedElement?: Element,
  hoverElement?: Element
};

export enum DragnDropEvents {
  HOVER_ENTER = 'bdg-dragdrop:hoverenter',
  HOVER_EXIT = 'bdg-dragdrop:hoverexit',
  DROP = 'bdg-dragdrop:drop'
};
