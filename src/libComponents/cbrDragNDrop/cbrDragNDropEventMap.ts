import type { CbrPinnedEvent, CbrHoverEnterEvent, CbrHoverExitEvent, DragnDropEvents, CbrUnpinnedEvent, CbrPinEvent, CbrUnpinEvent } from "./cbrDragNDropTypes";

declare global {
    interface HTMLElementEventMap {
      [DragnDropEvents.HOVER_ENTER]: CustomEvent<CbrHoverEnterEvent>;
      [DragnDropEvents.HOVER_EXIT]: CustomEvent<CbrHoverExitEvent>;
      [DragnDropEvents.PINNED]: CustomEvent<CbrPinnedEvent>;
      [DragnDropEvents.UNPINNED]: CustomEvent<CbrUnpinnedEvent>;
      [DragnDropEvents.PIN]: CustomEvent<CbrPinEvent>;
      [DragnDropEvents.UNPIN]: CustomEvent<CbrUnpinEvent>;
    }
  }
