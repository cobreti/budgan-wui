<template>
  <v-container class="d-flex flex-column align-left justify-center">

    <h1 class="h1-header">CSV Columns Settings</h1>
    <div class="setting-name-container controls-container">
      <label for="setting-name" class="setting-name-label">Setting Name:</label>
      <v-text-field
        id="setting-name"
        v-model="settingName"
        outlined
        dense
        clearable
        class="setting-name-input"
      />
    </div>
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
    </div>

    <v-row class="mb-4">
      <v-col cols="12">
        <!-- <h2 class="mb-6">Selected row </h2> -->
        <v-select
          v-model="currentRowIndex"
          :items="rows"
          item-value="lineNumber"
          item-title="record"
          density="compact"
          variant="outlined"
          hide-details
          :disabled="!csvContentPresent"
        />
      </v-col>
    </v-row>

    <!-- Header -->
    <h2 class="text-center mt-4 mb-6">Match information with the right CSV column</h2>

    <!-- Matching Section -->
    <v-row class="mt-4 mb-4">
      <!-- Matching Constant Tags -->
      <v-col cols="12">
        <v-row>
          <v-col cols="4" v-for="key in Object.keys(csvColumns)" :key="key">
            <h3 class="text-center mb-4">{{ key }}</h3>
            <v-select
              :items="currentRow"
              item-value="key"
              item-title="text"
              v-model="mapping[csvColumns[key]]"
              label="Select a column..."
              outlined
              dense
              clearable
              :disabled="!csvContentPresent"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Matched Results Display -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-center mb-4">Matched results</h2>
        <ul>
          <li v-for="(index) in Object.keys(csvColumns)" :key="index">
            {{ index }} → <strong>{{ mapping[csvColumns[index]] !== null ? currentRow[mapping[csvColumns[index]] as number].text : 'None' }}</strong>
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<style src="@cobreti/cbr-draggable/dist/style.css">
</style>

<style scoped>
  h1, h2 {
    color: #4A4A4A;
    text-align: center;
  }
</style>

<script setup lang="ts">
  import { computed, ref, type Ref } from 'vue';
  import { useCsvPreviewStore } from './csvPreview-store';
  import { CSVColumnContent } from '@/core/models/csvDocument';
  import { container } from '@/core/setupInversify'
  import type { IStreamFactory } from '@services/StreamFactory'
  import type { CsvParseResult, ICsvParser } from '@services/CsvParser'
  import { ServicesTypes } from '@services/types'

  const csvPreviewStore = useCsvPreviewStore();
  const mapping = csvPreviewStore.csvColumnContentMapping;
  
  const csvFileName = defineModel<File[]>();
  const settingName = ref('');

  const csvColumns : {[key: string]:CSVColumnContent} = {
    'card number': CSVColumnContent.CARD_NUMBER,
    'date inscription': CSVColumnContent.DATE_INSCRIPTION,
    'date transaction': CSVColumnContent.DATE_TRANSACTION,
    'amount': CSVColumnContent.AMOUNT,
    'description': CSVColumnContent.DESCRIPTION,
    'type': CSVColumnContent.TYPE,
  };

  const csvContentPreview : Ref<CsvParseResult | null> = ref(null);
  const csvHeaderIndex : Ref<number> = ref(-1);
  const selectedColumn = ref(-1);

  const csvContentPresent = computed(() => csvPreviewStore.csvRows.length > 0);

  const csvRows = computed(() => {
    return csvPreviewStore.csvRows.length > 0 ? csvPreviewStore.csvRows : [{
      records: ['No CSV file selected']
    }];
  });

  const rows = computed(() => csvRows.value.map((row: any, index: number) => {
    return {
      lineNumber: index,
      record: row?.records?.join(', ')
    };
  }));

  const currentRowIndex = ref(0);
  const currentRow = computed(() => (csvPreviewStore.csvRows[currentRowIndex.value]?.records || [])
    .reduce((acc: any[], value:string, index: number) => {
      acc.push({
        key: index,
        text: value
      });
      return acc;
    }, []));

  async function onFileNameUpdated(files: File[] | File) : Promise<void> {

    if (files) {
      const streamFactory = container.get<IStreamFactory>(ServicesTypes.StreamFactory);
      const csvParser = container.get<ICsvParser>(ServicesTypes.CsvParser);

      let file : File;

      if (Array.isArray(files)) {
        file = files[0];
      }
      else {
        file = files as File;
      }

      const inputStream = streamFactory.createFileReader(file);
      const text = await inputStream.read();

      csvParser.minimumColumnsCount = 4;
      csvContentPreview.value = csvParser.parse(text);

      csvPreviewStore.setCsvContentPreview(csvContentPreview.value);

      csvHeaderIndex.value = -1;
      selectedColumn.value = -1;
    }
    else {
      csvContentPreview.value = null;
      csvPreviewStore.clearCsvContentPreview();
    }
  }

</script>
