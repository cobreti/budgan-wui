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
          <v-btn @click="onAdd()">Add</v-btn>
          <v-btn @click="onDiscard()">Discard</v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="pt-4 pr-4 pl-4 pb-4 mt-2 h-100" v-show="statementPresent">
        <add-statement-account></add-statement-account>
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
  import AddStatementAccount from '@/components/add-statement/AddStatementAccount.vue';
  import {computed, defineModel} from 'vue';

  const ofxFileName = defineModel<File[]>();
  const addStatementStore = useAddStatementStore();

  const filename = computed(() => {
    return addStatementStore.loadedAccount.filename;
  });

  const statementPresent = computed(() => {
    return addStatementStore.loadedAccount.account != undefined;
  });

  function onFileNameUpdated(files: File[]) {

    if (files.length > 0) {
      addStatementStore.loadOfxFile(files[0]);
    }
  }

  function clear() {
    ofxFileName.value = [];
    addStatementStore.clear();
  }

  function onDiscard() {
    clear();
  }

  function onAdd() {
    const account = addStatementStore.loadedAccount.account;
    if (account != undefined) {
      useBankAccountsStore().addWithBankAccount(account);
      clear();
    }
  }

</script>

