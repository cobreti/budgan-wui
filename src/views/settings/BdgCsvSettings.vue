<template>
  <div>
    <div class="controls-container">
      <v-file-input
        id="csv-file-input"
        label="Select CSV file"
        class="csv-file-input"
        v-model="csvFileName"
        @update:modelValue="onFileNameUpdated"
        accept=".csv"
        :multiple="false"
      ></v-file-input>
      <div v-if="csvHeader">
        <bdg-column-selector :columns-count=csvHeader.length show-clear-selection @column-selected="onColumnSelected" @column-selection-cleared="onColumnSelectionCleared"/>
        <div>
          {{ csvHeader }}
        </div>
        <div>
          {{ csvHeader?.length || 0 }}
        </div>
        <div>
          {{ csvHeaderColumnValue }}
        </div>
      </div>

      <!--      <v-text-field-->
<!--        class="columns-count-field"-->
<!--        label="number of columns"-->
<!--        :rules="columnsCountRules"-->
<!--        v-model.number="numberOfColumns"-->
<!--        type="number">-->
<!--      </v-text-field>-->
<!--      <bdg-column-selector :columns-count=numberOfColumns show-clear-selection @column-selected="onColumnSelected" @column-selection-cleared="onColumnSelectionCleared"/>-->
<!--      <v-select-->
<!--        class ="columns-content-select"-->
<!--        :rules="columnContentValueRule"-->
<!--        :disabled="selectedColumn < 0"-->
<!--        :items="columnsContentValues"-->
<!--        item-title="text"-->
<!--        item-value="value"-->
<!--        v-model="columns[selectedColumn]">-->
<!--      </v-select>-->
<!--    </div>-->
<!--    <div class="preview">-->
<!--      <div class="title">Columns preview</div>-->
<!--      <span class="item" v-for="(column, index) in columnsPreview" :key="index">{{ column }}</span>-->
    </div>
  </div>
</template>

<style scoped>

  .csv-file-input {
  }

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
  import { computed, defineModel, type Ref, ref } from 'vue'
  import { CSVColumnContent, type CSVContentByColumn_Deprecated } from '@models/csvDocument'
  import { container } from '@/core/setupInversify'
  import { ServicesTypes } from '@services/types'
  import type { IStreamFactory } from '@services/StreamFactory'
  import type { CsvParseResult, ICsvParser } from '@services/CsvParser'


  const csvFileName = defineModel<File[]>();

  const csvContentPreview : Ref<CsvParseResult | null> = ref(null);
  const csvHeaderIndex : Ref<number> = ref(-1);

  const csvHeader = computed(() => {
    console.log('csvContentPreview', (csvContentPreview.value));
    return csvContentPreview.value?.content.header?.records;
  });

  const csvHeaderColumnValue = computed(() => {

    if (csvHeaderIndex.value < 0) {
      return '';
    }
    return csvContentPreview.value?.content.header?.records[csvHeaderIndex.value];
  });

  async function onFileNameUpdated(files: File[]) {

    const streamFactory = container.get<IStreamFactory>(ServicesTypes.StreamFactory);
    const csvParser = container.get<ICsvParser>(ServicesTypes.CsvParser);

    const inputStream = streamFactory.createFileReader(files[0]);
    const text = await inputStream.read();

    csvParser.minimumColumnsCount = 4;
    csvContentPreview.value = csvParser.parse(text);
    csvHeaderIndex.value = -1;
  }


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
  const columns: Ref<CSVContentByColumn_Deprecated> = ref({})
  const selectedColumn = ref(-1);
  const currentColumnContentValue: Ref<CSVColumnContent> = ref(CSVColumnContent.UNKNOWN);

  const columnsPreview = computed(() => {
    const result: string[] = [];
    const colsKeys = Object.keys(columns.value);

    for (let i = 0; i < numberOfColumns.value; i++) {
      const k:string = i.toString();
      if (colsKeys.includes(k)) {
        const eColContent = (columns.value)[k];
        result.push(columnsContentValues[eColContent]?.text || ' ');
      } else {
        result.push(' ');
      }
    }

    return result;
  });

  const columnsCountRules = [
    (v: number) => !!v || 'Columns count is required',
    (v: number) => v > 0 || 'Columns count must be greater than 0',
    (v: number) => v < 21 || 'Columns count must be at max 20'
  ];

  const columnContentValueRule = [
    (v: { }) => v !== undefined || 'Column content is required'
  ];

  function onColumnSelected(index: number) {
    csvHeaderIndex.value = index;

    // if (index in columns.value) {
    //   currentColumnContentValue.value = columns.value[index];
    // } else {
    //   currentColumnContentValue.value = CSVColumnContent.UNKNOWN;
    // }
    // console.log(`Column ${index} selected`);
  }

  function onColumnSelectionCleared() {
    selectedColumn.value = -1;
    // console.log('Column selection cleared');
  }
</script>
