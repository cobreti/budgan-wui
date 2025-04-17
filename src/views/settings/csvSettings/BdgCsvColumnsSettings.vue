<template>
  <v-container class="d-flex flex-column align-left justify-center">

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
            {{ index }} → <strong>{{ mapping[csvColumns[index]] !== undefined ? currentRow[mapping[csvColumns[index]] as number].text : 'None' }}</strong>
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
  import { computed, ref } from 'vue';
  import { useCsvSettingsStore } from './csvSettings-store';
  import { CSVColumnContent } from '@/core/models/csvDocument';

  const csvSettingsStore = useCsvSettingsStore();
  const mapping = csvSettingsStore.csvColumnContentMapping;
  
  const csvColumns : {[key: string]:CSVColumnContent} = {
    'card number': CSVColumnContent.CARD_NUMBER,
    'date inscription': CSVColumnContent.DATE_INSCRIPTION,
    'date transaction': CSVColumnContent.DATE_TRANSACTION,
    'amount': CSVColumnContent.AMOUNT,
    'description': CSVColumnContent.DESCRIPTION,
    'type': CSVColumnContent.TYPE,
  };

  const csvContentPresent = computed(() => csvSettingsStore.csvRows.length > 0);

  const csvRows = computed(() => {
    return csvSettingsStore.csvRows.length > 0 ? csvSettingsStore.csvRows : [{
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
  const currentRow = computed(() => (csvSettingsStore.csvRows[currentRowIndex.value]?.records || [])
    .reduce((acc: any[], value:string, index: number) => {
      acc.push({
        key: index,
        text: value
      });
      return acc;
    }, []));

</script>
