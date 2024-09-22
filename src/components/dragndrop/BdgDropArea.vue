<template>
  <div ref="drop-root">
    <slot></slot>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">

  import { onMounted, onUnmounted, useTemplateRef } from 'vue'
  import {
    type BdgDropEvent,
    type BdgHoverEnterEvent,
    type BdgHoverExitEvent,
    DragnDropEvents
  } from '@components/dragndrop/BdgDragndropTypes'

  const props = defineProps<{
    onHoverenter?: (event: BdgHoverEnterEvent) => void,
    onHoverexit?: (event: BdgHoverExitEvent) => void,
    onDrop?: (event: BdgDropEvent) => void
  }>();

  const dropRoot = useTemplateRef('drop-root');

  function onHoverEnter(event: CustomEvent) {
    if (props.onHoverenter) {
      props.onHoverenter({
        element: event.detail.element,
        preventDrop: () => {
          event.detail.preventDrop();
        }
      });
    }
  }

  function onHoverExit(event: CustomEvent) {
    if (props.onHoverexit) {
      props.onHoverexit({
        element: event.detail.element
      });
    }
  }

  function onDrop(event: CustomEvent) {
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
    dropRoot.value?.addEventListener(DragnDropEvents.DROP, onDrop);
  });

  onUnmounted(() => {
    dropRoot.value?.removeEventListener(DragnDropEvents.HOVER_ENTER, onHoverEnter);
    dropRoot.value?.removeEventListener(DragnDropEvents.HOVER_EXIT, onHoverExit);
    dropRoot.value?.removeEventListener(DragnDropEvents.DROP, onDrop);
  });
</script>
