<template>
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

</template>

<style>
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
  import {useAddStatementStore} from '@/stores/add-statement-store';
  import {computed, defineModel} from 'vue';
  import { container } from '@/core/setupInversify'
  import { ServicesTypes } from '@services/types'
  import AccountAdded from '@views/addStatement/AccountAdded.vue'
  import { useBankAccountsStore } from '@/stores/bankAccounts-store'
import { type IBankAccountLoader } from '@/core/services/BankAccountLoader';
import type { BankAccount } from '@/core/models/BankAccountTypes';

  const ofxFileName = defineModel<File[]>();
  const addStatementStore = useAddStatementStore();
  const bankAccountStore = useBankAccountsStore();

  const accountsIds = computed(() => {
    const accounts = addStatementStore.accountsGroupedById;
    return Object.keys(accounts);
  });

  const statementPresent = computed(() => {
    return Object.keys(addStatementStore.accounts).length > 0;
  });


  async function onFileNameUpdated(files: File[]) {

    const bankAccountLoader = container.get<IBankAccountLoader>(ServicesTypes.BankAccountLoader);

    if (!bankAccountLoader) {
      throw new Error('No BankAccountLoader service found');
    }

    bankAccountLoader.loadingFileStarted = (fileName: string) => {
      addStatementStore.setLoadingFile(fileName);
    }

    bankAccountLoader.accountLoaded = (id: string, fileName: string, account: BankAccount) => {
      // addStatementStore.setBankAccount(id, fileName, account);
    }

    await bankAccountLoader.load(files);
    bankAccountLoader.sanitize(bankAccountStore.accounts);

    for (const id in bankAccountLoader.accountsById) {
      const account = bankAccountLoader.accountsById[id];
      addStatementStore.setBankAccount(account.accountId, "", account);
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

    Object.values(accounts).forEach((accountBox) => {
      const account = accountBox.account;

      bankAccountStore.addWithBankAccount(account);
    });

    clear();
  }

</script>

