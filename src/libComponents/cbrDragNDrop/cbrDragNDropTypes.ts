export type CbrHoverEnterEvent = {
  element: Element,
  preventDrop: () => void
};

export type CbrHoverExitEvent = {
  element: Element
};

export type CbrPinEvent = {
  element: Element,
  preventDefault: () => void
};

export type CbrUnpinEvent = {
  element: Element
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
  PIN = 'bdg-dragdrop:drop',
  UNPIN = 'bdg-dragdrop:unpin'
};
