<template>
  <span ref="drop-root">
    <slot></slot>
  </span>
</template>

<style scoped>

</style>

<script setup lang="ts">

  import { onMounted, onUnmounted, useTemplateRef, type Ref } from 'vue'
  import {
    type CbrPinnedEvent,
    type CbrHoverEnterEvent,
    type CbrHoverExitEvent,
    DragnDropEvents,
    type CbrUnpinnedEvent
  } from '@libComponents/cbrDragNDrop/cbrDragNDropTypes'
  import '@libComponents/cbrDragNDrop/cbrDragNDropEventMap'


  const props = defineProps<{
    hoverEnter?: (event: CbrHoverEnterEvent) => void,
    hoverExit?: (event: CbrHoverExitEvent) => void,
    onPin?: (event: CbrPinnedEvent) => void,
    onUnpin?: (event: CbrUnpinnedEvent) => void,
  }>();

  const dropRoot : Ref<HTMLSpanElement | null> = useTemplateRef('drop-root');

  function onHoverEnter(event: CustomEvent<CbrHoverEnterEvent>) {
    if (props.hoverEnter) {
      props.hoverEnter({
        element: event.detail.element,
        preventDrop: () => {
          event.detail.preventDrop();
        }
      });
    }
  }

  function onHoverExit(event: CustomEvent<CbrHoverExitEvent>) {
    if (props.hoverExit) {
      props.hoverExit({
        element: event.detail.element
      });
    }
  }

  function onDraggablePin(event: CustomEvent<CbrPinnedEvent>) {
    let preventDefault = false;

    if (props.onPin) {
      props.onPin({
        element: event.detail.element,
        preventDefault: () => {
          preventDefault = true;
        }
      });
    }

    if (!preventDefault) {
      dropRoot.value?.appendChild(event.detail.element);
    }
  }

  function onDraggableUnpin(event: CustomEvent<CbrUnpinnedEvent>) {
    if (props.onUnpin) {
      props.onUnpin({
        element: event.detail.element
      });
    }
  }

  onMounted(() => {
    dropRoot.value?.addEventListener(DragnDropEvents.HOVER_ENTER, onHoverEnter);
    dropRoot.value?.addEventListener(DragnDropEvents.HOVER_EXIT, onHoverExit);
    dropRoot.value?.addEventListener(DragnDropEvents.PINNED, onDraggablePin);
    dropRoot.value?.addEventListener(DragnDropEvents.UNPINNED, onDraggableUnpin);
  });

  onUnmounted(() => {
    dropRoot.value?.removeEventListener(DragnDropEvents.HOVER_ENTER, onHoverEnter);
    dropRoot.value?.removeEventListener(DragnDropEvents.HOVER_EXIT, onHoverExit);
    dropRoot.value?.removeEventListener(DragnDropEvents.PINNED, onDraggablePin);
    dropRoot.value?.removeEventListener(DragnDropEvents.UNPINNED, onDraggableUnpin);
  });
</script>
