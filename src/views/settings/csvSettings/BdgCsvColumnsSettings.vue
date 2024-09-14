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
                  <v-select
                    flat
                    :items="ColumnMappingItems"
                    v-model="modelValues[index]"
                  >

                  </v-select>
                </div>
            </div>
      </div>
    </div>
</template>

<style scoped>
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
    import { computed, ref, type ModelRef } from 'vue';
    import { useCsvSettingsStore } from './csvSettings-store';
    import { CSVColumnContent } from '@/core/models/csvDocument';

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
</script>
