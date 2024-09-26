import type { CbrDropEvent, CbrHoverEnterEvent, CbrHoverExitEvent, DragnDropEvents } from "./cbrDragNDropTypes";

declare global {
    interface HTMLElementEventMap {
      [DragnDropEvents.HOVER_ENTER]: CustomEvent<CbrHoverEnterEvent>;
      [DragnDropEvents.HOVER_EXIT]: CustomEvent<CbrHoverExitEvent>;
      [DragnDropEvents.DROP]: CustomEvent<CbrDropEvent>;
    }
  }
