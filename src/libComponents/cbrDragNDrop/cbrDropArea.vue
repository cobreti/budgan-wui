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
    type CbrDropEvent,
    type CbrHoverEnterEvent,
    type CbrHoverExitEvent,
    DragnDropEvents
  } from '@libComponents/cbrDragNDrop/cbrDragNDropTypes'
  import '@libComponents/cbrDragNDrop/cbrDragNDropEventMap'


  const props = defineProps<{
    hoverEnter?: (event: CbrHoverEnterEvent) => void,
    hoverExit?: (event: CbrHoverExitEvent) => void,
    onDrop?: (event: CbrDropEvent) => void
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

  function onDraggableDrop(event: CustomEvent<CbrDropEvent>) {
    let preventDefault = false;

    if (props.onDrop) {
      props.onDrop({
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

  onMounted(() => {
    dropRoot.value?.addEventListener(DragnDropEvents.HOVER_ENTER, onHoverEnter);
    dropRoot.value?.addEventListener(DragnDropEvents.HOVER_EXIT, onHoverExit);
    dropRoot.value?.addEventListener(DragnDropEvents.DROP, onDraggableDrop);
  });

  onUnmounted(() => {
    dropRoot.value?.removeEventListener(DragnDropEvents.HOVER_ENTER, onHoverEnter);
    dropRoot.value?.removeEventListener(DragnDropEvents.HOVER_EXIT, onHoverExit);
    dropRoot.value?.removeEventListener(DragnDropEvents.DROP, onDraggableDrop);
  });
</script>
