export type CbrHoverEnterEvent = {
  element: Element,
  preventDrop: () => void
};

export type CbrHoverExitEvent = {
  element: Element
};

export type CbrPinnedEvent = {
  element: Element,
  preventDefault: () => void
};

export type CbrUnpinnedEvent = {
  element: Element
};

export type CbrPinEvent = {
  pinElement: Element
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
  HOVER_ENTER = 'cbr-dragdrop:hoverenter',
  HOVER_EXIT = 'cbr-dragdrop:hoverexit',
  // sent after the draggable element has been pinned
  PINNED = 'cbr-dragdrop:pinned',
  // sent after the draggable element has been unpinned
  UNPINNED = 'cbr-dragdrop:unpinned',
  // sent to pin the draggable element
  PIN = 'cbr-dragdrop:pin'
};
