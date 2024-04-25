<template>
  <div class="container">
    <account-view-transaction class="transaction" v-for="transaction in transactions" :key="transaction.transactionId" :transaction="transaction"></account-view-transaction>
  </div>
</template>

<style scoped>

  /* used to prevent a build error for missing variable declaration */
  :root {
    --v-theme-on-surface-variant: --v-theme-on-surface-variant
  }

  .container {
    display: block;
    position: relative;
    overflow: auto;
  }

  .transaction:nth-child(odd) {
    background-color: rgba(var(--v-theme-on-surface-variant));
  }
</style>

<script setup lang="ts">
  import 'vuetify/styles'
  import AccountViewTransaction from '@components/accountView/AccountViewTransaction.vue';
  import {useAccountViewStore} from '@/stores/accountView-store';
  import {computed} from 'vue';

  const accountViewStore = useAccountViewStore();

  const transactions = computed(() => {
    return accountViewStore.accountView.transactions;
  });

</script>
