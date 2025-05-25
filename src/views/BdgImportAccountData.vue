<template>
  <div>
    <v-card class="d-flex flex-column ma-2 pa-2">
      <div class="d-flex flex-row mb-2">
        <div class="d-flex flex-column justify-center mr-4 mb-4">
          <label for="ofx-file-input">
            File
          </label>
        </div>
        <v-file-input
          id="ofx-file-input"
          class=""
          v-model="files"
          accept=".json"
          :multiple="false"
        ></v-file-input>
      </div>
      <div class="d-flex flex-row justify-center">
        <v-btn
          @click="onImport"
          :disabled="!canImport"
        >Open</v-btn>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
</style>


<script setup lang="ts">
  import { useImportAccountsStore } from '@/stores/importAccounts-store'
  import { computed, ref } from 'vue'
  import { useBankAccountsStore } from '@/stores/bankAccounts-store'

  const importAccountsStore = useImportAccountsStore();
  const bankAccountsStore = useBankAccountsStore();

  const files = ref<File[]>([]);

  const canImport = computed(() => {
    return files.value && files.value.length > 0;
  });

  async function onImport() {
    if (files.value && files.value.length > 0) {
      await importAccountsStore.importAccountFromFile(files.value[0]);

      if (importAccountsStore.hasAccounts) {
        bankAccountsStore.clear();
        const accountsIds = Object.keys(importAccountsStore.accounts);
        accountsIds.forEach(accountId => {
          bankAccountsStore.addWithBankAccount(importAccountsStore.accounts[accountId]);
        });
        importAccountsStore.clear();
      }
      else {
        console.log("No accounts found in file");
      }
    }
  }

</script>
