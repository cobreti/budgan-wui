<template>
  <div class="container">
    <account-view-transaction-item class="transaction" v-for="transaction in transactions" :key="transaction.transactionId" :transaction="transaction">
    </account-view-transaction-item>
  </div>
</template>

<style scoped>
  .container {
    display: block;
    position: relative;
    overflow: auto;
  }

  .transaction:nth-child(odd) {
    background-color: rgba(var(--v-theme-on-surface-variant));
    padding-bottom: 2px;
    padding-top: 2px;
  }
</style>

<script setup lang="ts">
  import 'vuetify/styles'
  import type { AccountViewTransaction } from '@/stores/accountView-store'
  import AccountViewTransactionItem from '@components/accountView/AccountViewTransactionItem.vue'

  const props = defineProps<{
    transactions: AccountViewTransaction[]
  }>();

  console.log('transactions', props.transactions.values);

</script>
