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
  import { type IOfxToBankAccount } from '@services/OfxToBankAccount';
  import { ServicesTypes } from '@services/types'
  import type { IIdGenerator } from '@services/IdGenerator'
  import AccountAdded from '@views/addStatement/AccountAdded.vue'
  import { useBankAccountsStore } from '@/stores/bankAccounts-store'

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

    if (files.length == 0) {
      throw new Error('No file selected');
    }

    const ofxToBankAccount = container.get<IOfxToBankAccount>(ServicesTypes.OfxToBankAccount);
    if (!ofxToBankAccount) {
      throw new Error('No OfxToBankAccount service found');
    }

    const idGenerator = container.get<IIdGenerator>(ServicesTypes.IdGenerator);
    if (!idGenerator) {
      throw new Error('No IdGenerator service found');
    }

    for (const file of files) {
      addStatementStore.setLoadingFile(file.name);

      const account = await ofxToBankAccount.loadOfxFile(file);
      const id = idGenerator.generateId();

      addStatementStore.setBankAccount(id, file.name, account);
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

