<template>
    <div>
        Showing columns settings

        <div>
            {{ currentRow }}
        </div>

        <div class="d-flex flex-row justify-start align-content-space-evenly selector">
            <div v-for="(n, index) in columnsCount"
                :key="index"
                class="column-cell"
            >
                <div class="column-cell-text">
                    {{ currentRow[index] }}
                </div>
                <div>
                </div>
                <cbrDropArea 
                  class="drop-area" 
                  :hoverEnter="onHoverEnter" 
                  :hoverExit="onHoverExit" 
                  :onPin="onPin(index)"
                  :onUnpin="onUnpin(index)"
                  >

                </cbrDropArea>
            </div>
      </div>

      <div class="chip-area">
        <BdgDraggable class="draggable-item" pin-area-selector=".drop-area" free-area-selector=".chip-area" :controller="draggableController">
          <span id="test-2">test 2</span>
        </BdgDraggable>
        <BdgDraggable class="draggable-item" pin-area-selector=".drop-area" :state-changed="onStateChanged" free-area-selector=".chip-area">
          <span id="test">test</span>
        </BdgDraggable>
      </div>
    </div>
</template>

<style scoped>

  .drop-area {
    display: block;
    height: 2em;
    border: 1px solid blue;
    margin: 1em;
  }

  .chip-area {
    display: block;
    margin-top: 3em;
    border: 1px solid blue;
    min-height: 4em;
  }

  .selector {
    border: 1px dotted black;
    width: 100%;
    height: 100%;
    display: block;
  }

  .column-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: default;
    border: 1px solid black;
    width: 100%;
    min-width: 1em;
    min-height: 2em;
    padding-left: 0.5em;
    padding-right: 0.5em;

    .column-cell-text {
      display: block;
      text-align: center;
      font-size: small;
    }
  }

</style>

<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { useCsvSettingsStore } from './csvSettings-store';
    import BdgDraggable from '@/components/DragNDrop/BdgDraggable.vue';
    import cbrDropArea from '@libComponents/cbrDragNDrop/cbrDropArea.vue';
    import type { CbrDraggableState, CbrPinnedEvent, CbrHoverEnterEvent, CbrHoverExitEvent, CbrUnpinnedEvent } from '@/libComponents/cbrDragNDrop/cbrDragNDropTypes'
    import { CbrDraggableController } from '@/libComponents/cbrDragNDrop/cbrDraggableController';

    const csvSettingsStore = useCsvSettingsStore();

    const currentRowIndex = ref(0);
    const draggableController = ref(new CbrDraggableController({
      pinAreaSelector: '.drop-area',
      freeAreaSelector: '.chip-area',
    }));
    const currentRow = computed(() => csvSettingsStore.csvRows[currentRowIndex.value].records || []);
    const columnsCount = computed(() => currentRow.value.length);

    function onStateChanged(state: CbrDraggableState) {
      console.log('new state: ', state);
    }

    function onHoverEnter(event: CbrHoverEnterEvent) {
      console.log('onHoverEnter', event);
    }

    function onHoverExit(event: CbrHoverExitEvent) {
      console.log('onHoverExit', event);
    }

    function onPin(index: number) {
      return function(event: CbrPinnedEvent) {
        console.log(`column ${index} onPin`, event);
      }
    }

    function onUnpin(index: number) {
      return function(event: CbrUnpinnedEvent) {
        console.log(`column ${index} onUnpin`, event);
      }
    }


</script>
