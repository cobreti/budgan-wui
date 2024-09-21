<template>
  <div ref="drop-root">
    <slot></slot>
  </div>
</template>

<style scoped>

</style>

<script setup lang="ts">

import { onMounted, onUnmounted, useTemplateRef } from 'vue'

  const dropRoot = useTemplateRef('drop-root');

  function onHoverEnter(event: CustomEvent) {
    console.log('hover enter', event);
  }

  function onHoverExit(event: CustomEvent) {
    console.log('hover exit', event);
  }

  onMounted(() => {
    dropRoot.value?.addEventListener('bdg-dragdrop:hoverenter', onHoverEnter);
    dropRoot.value?.addEventListener('bdg-dragdrop:hoverexit', onHoverExit);
  });

  onUnmounted(() => {
    dropRoot.value?.removeEventListener('bdg-dragdrop:hoverenter', onHoverEnter);
    dropRoot.value?.removeEventListener('bdg-dragdrop:hoverexit', onHoverExit);
  });
</script>
