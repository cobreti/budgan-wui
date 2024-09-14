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
      <BdgCsvColumnsSettings></BdgCsvColumnsSettings>
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
  import BdgCsvColumnsSettings from './BdgCsvColumnsSettings.vue'
  import { defineModel, type Ref, ref, watch } from 'vue'
  import { container } from '@/core/setupInversify'
  import { ServicesTypes } from '@services/types'
  import type { IStreamFactory } from '@services/StreamFactory'
  import type { CsvParseResult, ICsvParser } from '@services/CsvParser'
  import { useCsvSettingsStore } from './csvSettings-store'

  const csvSettingsStore = useCsvSettingsStore();

  const csvFileName = defineModel<File[]>();
  const selectedColumn = ref(-1);

  const csvContentPreview : Ref<CsvParseResult | null> = ref(null);
  const csvHeaderIndex : Ref<number> = ref(-1);

  watch(selectedColumn, (newVal) => {
    console.log('selectedColumn : ', newVal);
  });

  async function onFileNameUpdated(files: File[]) {

    const streamFactory = container.get<IStreamFactory>(ServicesTypes.StreamFactory);
    const csvParser = container.get<ICsvParser>(ServicesTypes.CsvParser);

    const inputStream = streamFactory.createFileReader(files[0]);
    const text = await inputStream.read();

    csvParser.minimumColumnsCount = 4;
    csvContentPreview.value = csvParser.parse(text);

    csvSettingsStore.setCsvContentPreview(csvContentPreview.value);

    csvHeaderIndex.value = -1;
    selectedColumn.value = -1;
  }


</script>
