export type BdgHoverEnterEvent = {
  element: Element,
  preventDrop: () => void
};

export type BdgHoverExitEvent = {
  element: Element
};

export type BdgDropEvent = {
  element: Element,
  preventDefault: () => void
};

export const DragnDropEvents = {
  HOVER_ENTER: 'bdg-dragdrop:hoverenter',
  HOVER_EXIT: 'bdg-dragdrop:hoverexit',
  DROP: 'bdg-dragdrop:drop'
};
