<template>
  <v-container class="d-flex flex-column align-left justify-center mt-8">
    <!-- Header -->
    <h1 class="text-center mb-6">Match CSV Columns with Tags</h1>

    <!-- Matching Section -->
    <v-row>
      <!-- Matching Constant Tags -->
      <v-col cols="12">
        <v-row>
          <v-col cols="4" v-for="(tag, index) in csvColumns" :key="`tag-${index}`">
            <h2 class="text-center mb-4">{{ tag }}</h2>
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
    <v-row class="mt-8">
      <v-col cols="12">
        <h2 class="text-center mb-4">Matched Results</h2>
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

  .csv-column-item,
  .tag-item {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 4px;
  }


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
    import { computed, ref } from 'vue';
    import { useCsvSettingsStore } from './csvSettings-store';

    const csvSettingsStore = useCsvSettingsStore();


    const csvColumns = [
      'card number',
      'date inscription',
      'date transaction',
      'amount',
      'description',
      'type'
    ];

    const currentRowIndex = ref(1);
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
