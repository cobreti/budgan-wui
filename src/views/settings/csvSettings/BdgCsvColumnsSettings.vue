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
                  <!-- <v-select
                    flat
                    :items="ColumnMappingItems"
                    v-model="modelValues[index]"
                  >

                  </v-select> -->
                </div>
                <cbrDropArea class="drop-area" :hoverEnter="onHoverEnter" :hoverExit="onHoverExit" :on-drop="onDrop">

                </cbrDropArea>
            </div>
      </div>

      <div class="chip-area">
        <!-- <div id="test" class="draggable-item" @mousedown="onMouseDown"> -->
          <!-- <div>test</div> -->
        <cbrDraggable class="draggable-item" drop-area-class="drop-area" :state-changed="onStateChanged">
            <v-chip>
              test
            </v-chip>
<!--          <template v-slot:hoverdroparea>-->
<!--&lt;!&ndash;            <span>&nbsp;+</span>&ndash;&gt;-->
<!--          </template>-->
<!--          <template v-slot:indroparea>-->
<!--            <span>O</span>-->
<!--          </template>-->
        </cbrDraggable>
        <cbrDraggable class="draggable-item" drop-area-class="drop-area">
          <v-chip>
            test 2
          </v-chip>
          <template v-slot:hoverdroparea>
<!--            <span>&nbsp;+</span>-->
          </template>
        </cbrDraggable>
        <!-- </div> -->
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

    .draggable-item {
      /* background-color: cyan; */
      /* width: auto; */
      /* display: inline-block; */
    }
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
    import cbrDraggable from '@libComponents/cbrDragNDrop/cbrDraggable.vue';
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
