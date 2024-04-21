<template>
  <div>
    <v-card class="d-flex flex-column ma-2 pa-2">
      <div class="d-flex flex-row mb-2">
        <div class="d-flex flex-column justify-center mr-4 mb-4">
          <label for="ofx-file-input">
            OFX file
          </label>
        </div>
        <v-file-input
          id="ofx-file-input"
          class=""
          v-model="filename"
          accept=".json"
          :multiple="false"
          @update:modelValue="onFileNameUpdated"
        ></v-file-input>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
</style>


<script setup lang="ts">
  import { useImportAccountsStore } from '@/stores/importAccounts-store'

  const importAccountsStore = useImportAccountsStore();

  const filename = defineModel<File[]>();

  function onFileNameUpdated(files: File[]) {

    if (files.length > 0) {
      importAccountsStore.importAccountFromFile(files[0]);
    }
  }

</script>
