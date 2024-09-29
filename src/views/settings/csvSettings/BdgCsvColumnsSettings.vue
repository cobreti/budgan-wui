<template>
    <div v-if="hasCsvPreview">
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
                <cbrDropArea class="drop-area" :hoverEnter="onHoverEnter" :hoverExit="onHoverExit" :on-drop="onDrop">

                </cbrDropArea>
            </div>
      </div>

      <div class="chip-area">
        <BdgDraggable class="draggable-item" drop-area-class="drop-area" :state-changed="onStateChanged">
          test
        </BdgDraggable>
        <BdgDraggable class="draggable-item" drop-area-class="drop-area">
          test 2
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
    // import cbrDraggable from '@libComponents/cbrDragNDrop/cbrDraggable.vue';
    import cbrDropArea from '@libComponents/cbrDragNDrop/cbrDropArea.vue';
    import type { CbrDraggableState, CbrDropEvent, CbrHoverEnterEvent, CbrHoverExitEvent } from '@/libComponents/cbrDragNDrop/cbrDragNDropTypes'

    const csvSettingsStore = useCsvSettingsStore();

    const currentRowIndex = ref(0);
    const hasCsvPreview = computed(() => csvSettingsStore.csvRows.length > 0);
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

    function onDrop(event: CbrDropEvent) {
      // event.preventDefault();
    }


</script>
