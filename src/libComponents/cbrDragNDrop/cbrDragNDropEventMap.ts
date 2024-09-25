import type { BdgDropEvent, BdgHoverEnterEvent, BdgHoverExitEvent, DragnDropEvents } from "./cbrDragNDropTypes";

declare global {
    interface HTMLElementEventMap {
      [DragnDropEvents.HOVER_ENTER]: CustomEvent<BdgHoverEnterEvent>;
      [DragnDropEvents.HOVER_EXIT]: CustomEvent<BdgHoverExitEvent>;
      [DragnDropEvents.DROP]: CustomEvent<BdgDropEvent>;
    }
  }
