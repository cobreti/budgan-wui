<template>
  <div class="h-100">
    <div class="d-flex flex-column align-content-start ma-1 h-100">
      <div class="d-flex flex-row justify-center">
      </div>
      <div class="d-flex flex-row justify-space-between">
        <div>
          <span class="title">Statement Name : </span>
          <span>{{name}}</span>
        </div>
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
      <add-statement-transactions-groups class="mt-2 h-100"></add-statement-transactions-groups>
    </div>
  </div>
</template>

<style scoped>
  .title {
    font-weight: bold;  }
</style>

<script setup lang="ts">

  import {useAddStatementStore} from '@/stores/add-statement-store';
  import {computed} from 'vue';
  import AddStatementTransactionsGroups from '@/components/add-statement/AddStatementTransactionsGroups.vue';

  const addStatementStore = useAddStatementStore();

  const accountId = computed(() => {
    return addStatementStore.loadedAccount.account?.accountId;
  })

  const accountType = computed(() => {
    return addStatementStore.loadedAccount.account?.accountType;
  })

  const transactions = computed(() => {
    return addStatementStore.loadedAccount.account?.transactions;
  });

  const name = computed(() => {
    return (transactions.value) ? transactions.value[0].name : '';
  });

</script>