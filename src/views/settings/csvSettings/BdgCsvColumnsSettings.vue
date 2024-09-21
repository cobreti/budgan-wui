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
                <bdg-drop-area class="drop-area">

                </bdg-drop-area>
            </div>
      </div>

      <div class="chip-area">
        <!-- <div id="test" class="draggable-item" @mousedown="onMouseDown"> -->
          <!-- <div>test</div> -->
        <BdgDraggable class="draggable-item" drop-area-class="drop-area">
          <v-chip>test</v-chip>
        </BdgDraggable>
        <!-- </div> -->
      </div>
    </div>
</template>

<style scoped>

  .drop-area {
    display: block;
    width: 100%;
    height: 2em;
    border: 1px solid blue;
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
    import BdgDraggable from '@/components/dragndrop/BdgDraggable.vue';
    import { computed, ref, type ModelRef } from 'vue';
    import { useCsvSettingsStore } from './csvSettings-store';
    import { CSVColumnContent } from '@/core/models/csvDocument';
    import BdgDropArea from '@components/dragndrop/BdgDropArea.vue'

    type ColumnMappingItemValue = {
      csvColumnContent: CSVColumnContent | undefined;
    };

    type ColumnMappingItem = {
      title: string;
      value: ColumnMappingItemValue;
    };

    const csvSettingsStore = useCsvSettingsStore();

    const currentRowIndex = ref(0);
    const columnsSelectionModels : ModelRef<ColumnMappingItemValue>[] = [];
    const hasCsvPreview = computed(() => csvSettingsStore.csvRows.length > 0);
    const currentRow = computed(() => csvSettingsStore.csvRows[currentRowIndex.value].records || []);
    const columnsCount = computed(() => currentRow.value.length);
    const modelValues = computed(() => csvSettingsStore.columnsMappingModelValues )

    // const columnSelectionModel = defineModel('columnSelectionModel', {
    //   type: Object as () => ColumnMappingItemValue,
    //   default: () => ({
    //     csvColumnContent: undefined
    //   })
    // });

    const ColumnMappingItems : ColumnMappingItem[] = [
      {
        title: 'N/A',
        value: {
          csvColumnContent: undefined
        }
      },
      {
        title: 'Card Number',
        value: {
          csvColumnContent: CSVColumnContent.CARD_NUMBER
        }
      }
    ]

    function onDrag(event: DragEvent) {
      event.dataTransfer?.setData("text", event.target.id);
    }

    interface DragEventWithTransfer extends DragEvent {
      dataTransfer: DataTransfer;
    }

    function onDrop(event: DragEventWithTransfer): void {
      event.preventDefault();
      const data: string = event.dataTransfer.getData("text");
      const elm: HTMLElement | null = document.getElementById(data);
      if (elm) {
        event.target.appendChild(elm);
      }
    }

    function allowDrop(event) {
      event.preventDefault();
    }

    // function onMouseMove(event) {
    //   event.preventDefault();
    //   if (elm) {
    //     elm.style.left = `${event.clientX - elm.clientWidth/2}px`;
    //     elm.style.top = `${event.clientY - elm.clientHeight/2}px`;

    //     elm.hidden = true;
    //     const target = document.elementFromPoint(event.clientX, event.clientY);
    //     elm.hidden = false;

    //     if (target) {
    //       const dropArea = target.closest('.drop-area');
    //       if (dropArea) {
    //         // console.log(dropArea);
    //       }
    //       // if (dropArea) {
    //       //   dropArea.appendChild(elm);
    //       // }
    //     }
    //   }
    // }

    // let elm: HtmlElement | null = null;
    // let orgPosition = '';

    // function onMouseUp(event) {
    //   event.preventDefault();
    //   console.log('mouse up');

    //   window.removeEventListener('mousemove', onMouseMove);
    //   window.removeEventListener('mouseup', onMouseUp);

    //   elm.hidden = true;
    //     const target = document.elementFromPoint(event.clientX, event.clientY);
    //     elm.hidden = false;

    //     if (target) {
    //       const dropArea = target.closest('.drop-area');
    //       if (dropArea) {
    //         console.log(dropArea);
    //         dropArea.appendChild(elm);
    //       }
    //     }

    //     elm.style.position = orgPosition;
    //     elm = null;
    //   }

    // function onMouseDown(event) {
    //   event.preventDefault();
    //   console.log('mouse down');

    //   elm = event.target.closest('.draggable-item');
    //   // elm = event.target;
    //   orgPosition = elm.style.position;
    //   elm.style.position = 'fixed';

    //   window.addEventListener('mousemove', onMouseMove);
    //   window.addEventListener('mouseup', onMouseUp);
    // }
</script>
