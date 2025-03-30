<template>
    <div>
        Showing columns settings

        <div>
            {{ currentRow }}
        </div>

        <div class="d-flex flex-row justify-start align-content-space-evenly selector">
            <div v-for="(n, index) in columnsCount"
                :key="index"
                :id="'csv-column-' + index"
                class="column-cell"
            >
                <div class="column-cell-text">
                    {{ currentRow[index] }}
                </div>
                <div>
                </div>
                <div :id="'csv-drop-column-' + index" class="drop-area">
                </div>
            </div>
      </div>

      <div class="chip-area">
        <CbrDraggable id="test2" class="draggable-item" :controller="draggableController">
          <!-- <BdgDraggableItem :draggableObserver="draggableController.getDraggableObserver('test2')">
            
          </BdgDraggableItem> -->
          <span>test 2</span>
          
        </CbrDraggable>
        <CbrDraggable id="test" class="draggable-item" :controller="draggableController">
            <div>test</div>
            <template v-slot:decorator>
              <cbr-draggable-on-add class="draggable-item-icon">
                <v-icon class="add-icon" icon="mdi-plus-circle-outline"></v-icon>
              </cbr-draggable-on-add>
              <cbr-draggable-on-remove class="draggable-item-icon"  @click="onRemoveClicked">
                 <v-icon class="remove-icon" icon="mdi-close-circle-outline"></v-icon>
              </cbr-draggable-on-remove>
            </template>

          <!-- </BdgDraggableItem> -->
        </CbrDraggable>

        <CbrDraggable id="test 3" class="draggable-item" :controller="draggableController">
            <span>test 3</span>
        </CbrDraggable>
      </div>
    </div>
</template>

<style src="@cobreti/cbr-draggable/dist/style.css">
</style>

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

  
  .draggable-item {
    display: inline-block;
    position: relative;
    background-color: lightgray;
    padding: 0.25em;
    border: 1px solid blue;
    border-radius: 0.5em;
    min-width: 3em;
    text-align: center;
    cursor: grab;

    div {
      display: inline-block;
    }

    .draggable-item-icon {
      display: inline-block;
      width: 0;
      height: 0;
    }

    .add-icon {
      color: green;
      width: 0;
      transform: translate(-25%, -50%);
      cursor: default;
    }

    .remove-icon {
      color: red;
      transform: translate(-25%, -50%);
      cursor: pointer;
    }

  }

</style>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { useCsvSettingsStore } from './csvSettings-store';
    import { CbrDraggable, CbrDraggableController, CbrDraggableOnRemove, CbrDraggableOnAdd, type CbrDraggableInterface } from "@cobreti/cbr-draggable";

    const csvSettingsStore = useCsvSettingsStore();

    const currentRowIndex = ref(0);
    const draggableController = ref(new CbrDraggableController({
      pinAreaSelector: '.drop-area',
      freeAreaSelector: '.chip-area',
    }));
    const currentRow = computed(() => csvSettingsStore.csvRows[currentRowIndex.value].records || []);
    const columnsCount = computed(() => currentRow.value.length);

    onMounted(() => {
      // draggableController.value.getDraggable('test2')?.pin(document.getElementById('csv-drop-column-0') as HTMLElement);
    });

    function onRemoveClicked(draggable: CbrDraggableInterface) {
    draggable.unpin();
  }

</script>
