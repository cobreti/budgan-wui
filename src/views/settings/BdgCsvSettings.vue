<template>
  <div>
    <div class="controls-container">
      <v-text-field
        class="columns-count-field"
        label="number of columns"
        :rules="columnsCountRules"
        v-model.number="numberOfColumns"
        type="number">
      </v-text-field>
      <bdg-column-selector :columns-count=numberOfColumns show-clear-selection @column-selected="onColumnSelected" @column-selection-cleared="onColumnSelectionCleared"/>
      <v-select
        class ="columns-content-select"
        :rules="columnContentValueRule"
        :disabled="selectedColumn < 0"
        :items="columnsContentValues"
        item-title="text"
        item-value="value"
        v-model="columns[selectedColumn]">
      </v-select>
    </div>
    <div class="preview">
      <div class="title">Columns preview</div>
      <span class="item" v-for="(column, index) in columnsPreview" :key="index">{{ column }}</span>
    </div>
  </div>
</template>

<style scoped>
  .controls-container {
    width: 50%;
    margin: 2em;
  }

  .columns-count-field {
    width: 15em;
  }

  .columns-content-select {
    width: 20em;
    margin-top: 1em;
  }

  .preview {
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 5em;

    .title {
      margin-bottom: 1em;
      font-size: larger;
      font-weight: bolder;
      border-bottom: 1px solid black;
      text-align: center;
    }

    .item {
      padding-right: 1em;
      margin-right: 1em;
      border-right: 1px solid black;
    }

    .item:last-child {
      border-right: none;
    }
  }
</style>

<script setup lang="ts">
  import BdgColumnSelector from '@components/BdgColumnSelector.vue'
  import { computed, type Ref, ref } from 'vue'
  import { CSVColumnContent, type CSVContentByColumn } from '@models/csvDocument'

  const columnsContentValues = [
    {
      value: CSVColumnContent.UNKNOWN,
      text: 'Unknown'
    },
    {
      value: CSVColumnContent.CARD_NUMBER,
      text: 'card number'
    },
    {
      value: CSVColumnContent.DATE_INSCRIPTION,
      text: 'date inscription'
    },
    {
      value: CSVColumnContent.DATE_TRANSACTION,
      text: 'date transaction'
    },
    {
      value: CSVColumnContent.AMOUNT,
      text: 'amount'
    },
    {
      value: CSVColumnContent.DESCRIPTION,
      text: 'description'
    }
  ];

  const numberOfColumns = ref(3);
  const columns: Ref<CSVContentByColumn> = ref({})
  const selectedColumn = ref(-1);
  const currentColumnContentValue: Ref<CSVColumnContent> = ref(CSVColumnContent.UNKNOWN);

  const columnsPreview = computed(() => {
    const result: string[] = [];
    const colsKeys = Object.keys(columns.value);

    for (let i = 0; i < numberOfColumns.value; i++) {
      const k:string = i.toString();
      if (colsKeys.includes(k)) {
        const eColContent = columns.value[k];
        result.push(columnsContentValues[eColContent]?.text || ' ');
      } else {
        result.push(' ');
      }
    }

    return result;
  });

  const columnsCountRules = [
    (v: number) => !!v || 'Columns count is required',
    (v: number) => /^\d+$/.test(v) || 'Columns count must be a number',
    (v: number) => v > 0 || 'Columns count must be greater than 0',
    (v: number) => v < 21 || 'Columns count must be at max 20'
  ];

  const columnContentValueRule = [
    (v: { }) => v !== undefined || 'Column content is required'
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
