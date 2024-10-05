<template>
  <div class="draggable-content">
    <CbrDraggable
      :id="props.id"
      :pin-area-selector="pinAreaSelector"
      :free-area-selector="freeAreaSelector"
      :hover-enter="onHoverEnter"
      :hover-exit="onHoverExit"
      :state-changed="onStateChanged"
      :controller="props.controller"
      ref="cbrdraggable"
    >
      <v-chip>
        <slot></slot>
        <v-icon
          cbr-dragndrop-no-pick
          class="remove-icon"
          icon="mdi-close"
          :hidden="hideRemoveIcon"
          @click="onUnpin"
        >
        </v-icon>
      </v-chip>
      <v-icon 
        class="add-icon" 
        icon="mdi-plus-circle-outline"
        :hidden="hideAddIcon"
      >
      </v-icon>
    </CbrDraggable>
  </div>
</template>

<style scoped>
  .draggable-content {
    display: inline-block;
    cursor: default;
  }

  .add-icon {
    transform: translate(-50%, -50%);
    color: green;
  }

  .remove-icon {
    margin-left: 0.5em;
    cursor: pointer;
  }

  .remove-icon:hover {
    color: red;
  }
</style>

<script setup lang="ts">
  import CbrDraggable from '@/libComponents/cbrDragNDrop/cbrDraggable.vue'
  import type { CbrDraggableControllerInterface } from '@/libComponents/cbrDragNDrop/cbrDraggableController';
  import {
    type CbrDraggableState,
    type CbrHoverEnterEvent,
    type CbrHoverExitEvent,
  } from '@/libComponents/cbrDragNDrop/cbrDragNDropTypes'
  import { computed, ref } from 'vue'

  const refState = ref<CbrDraggableState>();

  const props = defineProps<{
    id: string,
    freeAreaSelector: string,
    pinAreaSelector: string,
    controller?: CbrDraggableControllerInterface,
    hoverEnter?: (event: CbrHoverEnterEvent) => void,
    hoverExit?: (event: CbrHoverExitEvent) => void,
    stateChanged?: (state: CbrDraggableState) => void
  }>()

  const hideAddIcon = computed(() => {
    return refState.value?.hoverArea === undefined;
  });

  const hideRemoveIcon = computed(() => {
    return refState.value?.pinArea === undefined || refState.value?.state === 'dragging';
  });

  function onUnpin() {
    props.controller?.getDraggable(props.id)?.unpin();
  }

  function onHoverEnter(event: CbrHoverEnterEvent) {
    if (props.hoverEnter) {
      props.hoverEnter(event)
    }
  }

  function onHoverExit(event: CbrHoverExitEvent) {
    if (props.hoverExit) {
      props.hoverExit(event)
    }
  }

  function onStateChanged(state: CbrDraggableState) {
    refState.value = state;

    if (props.stateChanged) {
      props.stateChanged(state)
    }
  }

</script>
