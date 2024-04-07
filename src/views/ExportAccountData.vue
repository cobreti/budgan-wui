<template>
  <div>
    <v-btn
      :href="accountsDataObjecTUrl"
      :download="filename"
      >Download data</v-btn>
  </div>
</template>

<style scoped>
</style>


<script setup lang="ts">

  import { computed } from 'vue'
  import { ServicesTypes } from '@/services/types'
  import { container } from '@/setupInversify'
  import type { IExportService } from '@/services/ExportService'

  const filename = "test-2.json"

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
