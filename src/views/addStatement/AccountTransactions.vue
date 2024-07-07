<template>
  <div class="page-container pa-2">
    <div class="d-flex flex-column align-content-start h-100">
      <v-card>
        <v-btn @click="onBack" flat>
          <v-icon class="ma-0 pa-0" icon="mdi-chevron-left" size="large"></v-icon>
        </v-btn>
      </v-card>
      <v-card class="pt-4 pr-4 pl-4 pb-4 mt-2">
        <div class="d-flex flex-column align-content-start ma-1 h-100">
          <div class="d-flex flex-row justify-center"></div>
          <div class="d-flex flex-row justify-space-between mt-2">
            <div>
              <span class="title">Account # : </span>
              <span>{{ accountId }}</span>
            </div>
            <div v-show="accountType != ''">
              <span class="title">Account type : </span>
              <span>{{ accountType }}</span>
            </div>
          </div>
          <div class="mt-2" v-if="filteredTransactions">
            <filtered-transactions-list
              :filtered-transactions="filteredTransactions"
            ></filtered-transactions-list>
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
  import { IdentityFilter } from '@/core/filters/IdentityFilter'
  import { useAddStatementStore } from './store/add-statement-store'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import FilteredTransactionsList from '@components/filteredTransactionsList.vue'
import type { BankAccount } from '@/core/models/BankAccountTypes'

  const route = useRoute();
  const router = useRouter();
  const id = route.params.id as string;

  const addStatementStore = useAddStatementStore()

  const accountToAdd = computed((): BankAccount => {
    return addStatementStore.accounts[id]
  })

  const noNewTransactions = computed(() => {
    return !accountToAdd.value || accountToAdd.value.transactionsGroups.length == 0
  })

  const accountId = computed(() => {
    return accountToAdd.value.accountId
  })

  const accountType = computed(() => {
    return accountToAdd.value ? accountToAdd.value.accountType : ''
  })

  const filteredTransactions = computed(() => {
    return accountToAdd.value ? IdentityFilter(accountToAdd.value) : null
  })

  function onBack() {
    router.push({ name: 'addStatement', replace: true });
  }
</script>
