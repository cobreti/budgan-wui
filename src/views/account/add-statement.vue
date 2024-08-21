<template>
  <div>
    <account-header>
      <v-btn
        flat
        :to="{path: 'transactions', replace: true}">
<!--        <v-icon-->
<!--          size="24"-->
<!--          icon="mdi-file-upload-outline"></v-icon>-->
        transactions
      </v-btn>
    </account-header>
    <div class="page-container pa-2">
      <div class="d-flex flex-column align-content-start h-100">
        <v-card class="file-input-card pt-4 pr-4 pl-4 pb-4 mr-2 mb-2" :class="{'d-none': statementPresent}">
          <div class="d-flex flex-row">
            <div class="d-flex flex-column justify-center mr-4 mb-4">
              <label for="ofx-file-input">
                OFX file
              </label>
            </div>
            <v-file-input
              id="ofx-file-input"
              class=""
              v-model="ofxFileName"
              :disabled = "addStatementStore.loading"
              @update:modelValue="onFileNameUpdated"
              accept=".ofx"
              :multiple="true"
            ></v-file-input>
          </div>
        </v-card>
        <v-card class="action-card" v-show="statementPresent">
          <div class="d-flex flex-column align-content-center ma-5">
            <v-expansion-panels class="elevation-0">
              <account-added v-for="id in accountsIds" :key="id" :accountId="id"></account-added>
            </v-expansion-panels>
          </div>
          <v-card-actions class="d-flex flex-grow-1 flex-row justify-center">
            <v-btn @click="onAdd">Add</v-btn>
            <v-btn @click="onDiscard()">Discard</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .page-container {
    height: 100%;
  }

  .file-input-card {
    flex: 1 1 0;
    display: block;
    position: relative;
    min-height: 10em;
  }
</style>

<script setup lang="ts">
  import AccountHeader from '@views/account/account-header.vue'
  import AccountAdded from '@views/account/AccountAdded.vue'
  import { computed, defineModel } from 'vue'
  import { useAddStatementStore } from '@/stores/add-statement-store'
  import { useBankAccountsStore } from '@/stores/bankAccounts-store'
  import { container } from '@/core/setupInversify'
  import type { IBankAccountLoader } from '@services/BankAccountLoader'
  import { ServicesTypes } from '@services/types'

  const ofxFileName = defineModel<File[]>();
  const addStatementStore = useAddStatementStore();
  const bankAccountStore = useBankAccountsStore();

  const accountsIds = computed(() => {
    return addStatementStore.accountsIds;
  });

  const statementPresent = computed(() => {
    return accountsIds.value.length > 0;
  });


  async function onFileNameUpdated(files: File[]) {

    if (files.length == 0) {
      return;
    }

    const bankAccountLoader = container.get<IBankAccountLoader>(ServicesTypes.BankAccountLoader);

    if (!bankAccountLoader) {
      throw new Error('No BankAccountLoader service found');
    }

    bankAccountLoader.loadingFileStarted = (fileName: string) => {
      addStatementStore.setLoadingFile(fileName);
    }

    await bankAccountLoader.load(files);
    bankAccountLoader.sanitize(bankAccountStore.accounts);

    for (const id in bankAccountLoader.accountsById) {
      const account = bankAccountLoader.accountsById[id];
      addStatementStore.setBankAccount(account);
    }

    addStatementStore.clearLoadingFileStatus();
  }

  function clear() {
    ofxFileName.value = [];
    addStatementStore.clear();
  }

  function onDiscard() {
    clear();
  }

  function onAdd() {
    const accounts = addStatementStore.accounts;

    Object.values(accounts).forEach((account) => {
      bankAccountStore.addWithBankAccount(account);
    });

    clear();
  }
</script>
