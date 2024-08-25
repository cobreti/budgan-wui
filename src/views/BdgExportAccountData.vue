<template>
  <div>
    <v-card class="d-flex flex-column ma-2 pa-2">
      <div class="d-flex flex-row mb-2">
        <v-text-field class="filename-input" label="Name" v-model="filename"
          :rules="[
            (v: string) => !!v || 'Field is required',
            (v: string) => /^[\w-]+$/.test(v) || 'Name must only contain alphabets, numeric, _ and -',
            (v: string) => /^[a-zA-Z].*$/.test(v) || 'Name must start with a letter'
          ]"
          ></v-text-field>
      </div>
      <div class="ml-2 mt-4">
        <div class="mb-4 font-weight-black">Accounts</div>
        <bdg-accounts-selector class="ml-2" v-model:selected-accounts="selection"></bdg-accounts-selector>
      </div>
      <div class="d-flex flex-row justify-center">
        <v-btn
          :href="accountsDataObjectUrl"
          :download="computedFilename"
          :disabled="!canDownload"
        >Export</v-btn>
      </div>
    </v-card>
  </div>
</template>

<style scoped>

</style>


<script setup lang="ts">

import { computed, ref, watchEffect } from 'vue'
  import BdgAccountsSelector from '@components/BdgAccountsSelector.vue'
  import type { BankAccountsSelection } from '@models/BankAccountSelectorTypes'
  import { useBankAccountsStore } from '@/stores/bankAccounts-store'
  import { useExportAccountsStore } from '@/stores/exportAccounts-store'
  import { onBeforeRouteLeave } from 'vue-router'

  const bankAccountsStore = useBankAccountsStore();
  const exportAccountsStore = useExportAccountsStore();

  const selection = ref<BankAccountsSelection>(
    Object.values(bankAccountsStore.accounts).map(account => account.accountId)
  );

  const accountsDataObjectUrl = ref<string>("");

  const filename = defineModel<string>();
  filename.value = ""

  const computedFilename = computed(() => {

    if (filename.value == "")
      return "";

    return `${filename.value}.json`;
  });

  const canDownload = computed(() => {
    return filename.value != "" && selection.value.length > 0 && accountsDataObjectUrl.value != "";
  });

  const selectionUnwatch = watchEffect( async () => {
    accountsDataObjectUrl.value = "";
    exportAccountsStore.getSaveBankAccountDataForAllAccounts(selection.value);

    const json = JSON.stringify(exportAccountsStore.exportContent);
    const blob = new Blob([json], { type: 'application/json' });
    accountsDataObjectUrl.value = URL.createObjectURL(blob);
  });

  onBeforeRouteLeave((to, from, next) => {
    selectionUnwatch();
    exportAccountsStore.clear();
    next();
  });

</script>
