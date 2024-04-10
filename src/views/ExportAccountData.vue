<template>
  <div>
    <v-card class="d-flex flex-column ma-2 pa-2">
      <div class="d-flex flex-row mb-2">
        <v-text-field class="filename-input" label="Filename" v-model="filename"
          :rules="[
            v => !!v || 'Field is required',
            v => /^[\w-]+$/.test(v) || 'Name must only contain alphabets, numeric, _ and -',
            v => /^[a-zA-Z].*$/.test(v) || 'Name must start with a letter'
          ]"
          ></v-text-field>
      </div>
      <div class="d-flex flex-row justify-end">
        <div class="d-flex mr-10 align-center">
          <span>
            {{computedFilename}}
          </span>
        </div>
        <v-btn
          :href="accountsDataObjecTUrl"
          :download="filename"
          :disabled="!filename"
        >Download data</v-btn>
      </div>
    </v-card>
  </div>
</template>

<style scoped>

</style>


<script setup lang="ts">

  import { computed } from 'vue'
  import { ServicesTypes } from '@/services/types'
  import { container } from '@/setupInversify'
  import type { IExportService } from '@/services/ExportService'

  const filename = defineModel<string>();
  filename.value = ""

  const computedFilename = computed(() => {

    if (filename.value == "")
      return "";

    return `${filename.value}.json`;
  })


  const accountsDataObjecTUrl = computed(() => {

    const exportService: IExportService = container.get(ServicesTypes.ExportService)

    const SavedData = {
      accounts: exportService.getSaveBankAccountDataForAllAccounts()
    };

    const json = JSON.stringify(SavedData);
    const blob = new Blob([json], { type: 'application/json' });
    return URL.createObjectURL(blob);
  });

</script>
