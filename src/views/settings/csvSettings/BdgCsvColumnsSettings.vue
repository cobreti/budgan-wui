<template>
  <v-container class="d-flex flex-column align-left justify-center mt-8">

    <v-row class="mb-4">
      <v-col cols="12">
        <h2 class="mb-6">Selected row </h2>
        <v-select
          v-model="currentRowIndex"
          :items="rows"
          item-value="lineNumber"
          item-title="record"
          density="compact"
          variant="outlined"
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Header -->
    <h2 class="text-center mt-4 mb-6">Match Tags with the right CSV column</h2>

    <!-- Matching Section -->
    <v-row class="mt-4 mb-4">
      <!-- Matching Constant Tags -->
      <v-col cols="12">
        <v-row>
          <v-col cols="4" v-for="(tag, index) in csvColumns" :key="`tag-${index}`">
            <h3 class="text-center mb-4">{{ tag }}</h3>
            <v-select
              :items="currentRow"
              item-value="key"
              item-title="text"
              v-model="matchedColumns[index]"
              label="Select a column..."
              outlined
              dense
              clearable
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Matched Results Display -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-center mb-4">Matched Results Example</h2>
        <ul>
          <li v-for="(matchedColumn, index) in matchedColumns" :key="`result-${index}`">
            {{ csvColumns[index] }} → <strong>{{ matchedColumn !== null ? currentRow[matchedColumn].text : 'None' }}</strong>
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

    const csvSettingsStore = useCsvSettingsStore();
    const mapping = csvSettingsStore.columnsMappingModelValues;



    const csvColumns = [
      'card number',
      'date inscription',
      'date transaction',
      'amount',
      'description',
      'type'
    ];

    const rows = computed(() => csvSettingsStore.csvRows.map((row: any, index: number) => {
      return {
        lineNumber: index,
        record: row.records.join(', ')
      };
    }));

    const currentRowIndex = ref(0);
    const currentRow = computed(() => (csvSettingsStore.csvRows[currentRowIndex.value].records || [])
      .reduce((acc: any[], value:string, index: number) => {
        acc.push({
          key: index,
          text: value
        });
        return acc;
      }, []));

    const matchedColumns = ref(Array(currentRow.value.length).fill(null)); // Array to track user's selections

</script>
