<template>
  <div>
    <div class="controls-container">
      <v-text-field
        class="columns-count-field"
        label="number of columns"
        :rules="columnsCountRules"
        v-model="numberOfColumns"
        type="number">
      </v-text-field>
      <bdg-column-selector :columns-count=numberOfColumns show-clear-selection @column-selected="onColumnSelected" @column-selection-cleared="onColumnSelectionCleared"/>
      <v-select
        class ="columns-content-select"
        :rules="columnContentValueRule"
        :disabled="selectedColumn < 0"
        :items="columnsContentValues"
        v-model="columns[selectedColumn]">
      </v-select>
    </div>
  </div>
</template>

<style scoped>
  .controls-container {
    display: block;
    width: 50%;
    height: 2em;
    margin: 2em;
  }

  .columns-count-field {
    width: 15em;
  }

  .columns-content-select {
    width: 20em;
    margin-top: 1em;
  }
</style>

<script setup lang="ts">
  import BdgColumnSelector from '@components/BdgColumnSelector.vue'
  import { type Ref, ref } from 'vue'
  import { CSVColumnContent, type CSVContentByColumn } from '@models/csvDocument'

  const columnsContentValues = [
    'Unknown',
    'card number',
    'date inscription',
    'date transaction',
    'amount',
    'description'
  ];

  const numberOfColumns = ref(3);
  const columns: Ref<CSVContentByColumn> = ref({})
  const selectedColumn = ref(-1);
  const currentColumnContentValue: Ref<CSVColumnContent> = ref(CSVColumnContent.UNKNOWN);

  const columnsCountRules = [
    (v: string) => !!v || 'Columns count is required',
    (v: string) => /^\d+$/.test(v) || 'Columns count must be a number',
    (v: string) => Number(v) > 0 || 'Columns count must be greater than 0',
    (v: string) => Number(v) < 21 || 'Columns count must be at max 20'
  ];

  const columnContentValueRule = [
    (v: string) => !!v || 'Column content is required'
  ];

  function onColumnSelected(index: number) {
    selectedColumn.value = index;

    if (index in columns.value) {
      currentColumnContentValue.value = columns.value[index];
    } else {
      currentColumnContentValue.value = CSVColumnContent.UNKNOWN;
    }
    // console.log(`Column ${index} selected`);
  }

  function onColumnSelectionCleared() {
    selectedColumn.value = -1;
    // console.log('Column selection cleared');
  }
</script>
