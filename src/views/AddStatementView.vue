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
              :disabled = "addStatementStore.loadedAccount.loading"
              @update:modelValue="onFileNameUpdated"
              accept=".ofx"
              :multiple="false"
          ></v-file-input>
        </div>
      </v-card>
      <v-card class="action-card" v-show="statementPresent">
        <div class="ml-5 mt-1">{{filename}}</div>
        <v-card-actions class="d-flex flex-grow-1 flex-row justify-center">
          <v-btn @click="onAdd()" v-show="!noNewTransactions">Add</v-btn>
          <v-btn @click="onDiscard()">Discard</v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="pt-4 pr-4 pl-4 pb-4 mt-2" v-show="statementPresent">
        <div class="d-flex flex-column align-content-start ma-1 h-100">
          <div class="d-flex flex-row justify-center">
          </div>
          <div class="d-flex flex-row justify-space-between mt-2">
            <div>
              <span class="title">Account # : </span>
              <span>{{accountId}}</span>
            </div>
            <div v-show="accountType != ''">
              <span class="title">Account type : </span>
              <span>{{accountType}}</span>
            </div>
          </div>
          <div class="mt-2">
            <filtered-transactions-list :filtered-transactions="filteredTransactions"></filtered-transactions-list>
          </div>
          <div class="d-flex flex-row justify-center mt-8" v-if="noNewTransactions">
            <div>
              <span>No new transactions</span>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </div>

</template>

<style>
  .page-container {
    height: 100%;
  }

  .action-card {
    flex: 1 1 0;
    display: block;
    position: relative;
    min-height: 5em;
    max-height: 5em;
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
  import {useBankAccountsStore} from '@/stores/bankAccounts-store';
  import {computed, defineModel} from 'vue';
  import { IdentityFilter } from '@/core/filters/IdentityFilter'
  import FilteredTransactionsList from '@components/filteredTransactionsList.vue'
  import { container } from '@/core/setupInversify'
  import { type IOfxToBankAccount } from '@/core/services/OfxToBankAccount';
  import { ServicesTypes } from '@services/types'

  const ofxFileName = defineModel<File[]>();
  const addStatementStore = useAddStatementStore();

  const filename = computed(() => {
    return addStatementStore.loadedAccount.filename;
  });

  const statementPresent = computed(() => {
    return addStatementStore.loadedAccount.account != undefined;
  });

  const noNewTransactions = computed(() => {
    return filteredTransactions.value.transactions.length == 0;
  });

  const accountId = computed(() => {
    return addStatementStore.loadedAccount.account?.accountId;
  })

  const accountType = computed(() => {
    return addStatementStore.loadedAccount.account?.accountType;
  })

  const filteredTransactions = computed(() => {
    return IdentityFilter(addStatementStore.accountWithNewTransactionsOnly);
  });


  async function onFileNameUpdated(files: File[]) {

    if (files.length == 0) {
      throw new Error('No file selected');
    }

    const ofxToBankAccount = container.get<IOfxToBankAccount>(ServicesTypes.OfxToBankAccount);
    if (!ofxToBankAccount) {
      throw new Error('No OfxToBankAccount service found');
    }

    const file = files[0];

    addStatementStore.setLoadingFile(file.name);

    const account = await ofxToBankAccount.loadOfxFile(file);

    addStatementStore.setBankAccount(account);
  }

  function clear() {
    ofxFileName.value = [];
    addStatementStore.clear();
  }

  function onDiscard() {
    clear();
  }

  function onAdd() {
    const account = addStatementStore.accountWithNewTransactionsOnly;
    if (account != undefined) {
      useBankAccountsStore().addWithBankAccount(account);
      clear();
    }
  }

</script>

