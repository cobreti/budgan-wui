import type { CbrPinEvent, CbrHoverEnterEvent, CbrHoverExitEvent, DragnDropEvents, CbrUnpinEvent } from "./cbrDragNDropTypes";

declare global {
    interface HTMLElementEventMap {
      [DragnDropEvents.HOVER_ENTER]: CustomEvent<CbrHoverEnterEvent>;
      [DragnDropEvents.HOVER_EXIT]: CustomEvent<CbrHoverExitEvent>;
      [DragnDropEvents.PIN]: CustomEvent<CbrPinEvent>;
      [DragnDropEvents.UNPIN]: CustomEvent<CbrUnpinEvent>;
    }
  }
