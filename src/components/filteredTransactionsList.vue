<template>
  <div>
    <div class="transaction" v-for="transaction in filteredTransactions.transactions" :key="transaction.transactionId">
      <div class="d-flex flex-row justify-start">
        <div class="date mr-4">
          <span>{{transaction.date.toLocaleString()}}</span>
        </div>
        <div class="type mr-4">
          <span>{{transaction.type}}</span>
        </div>
        <div class="description mr-4">
          <span>{{transaction.description}}</span>
        </div>
        <div class="amount mr-4">
          <span>{{transaction.amount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .date {
    min-width: 15em;
  }

  .type {
    min-width: 10em;
  }

  .description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-grow: 1;
    min-width: 10em;
  }

  .amount {
    min-width: 10em;
    text-align: right;
  }

  .transaction {
  }

  .transaction:nth-child(odd) {
    background-color: rgba(var(--v-theme-on-surface-variant));
  }
</style>

<script setup lang="ts">
  import type { FilteredTransactions } from '@models/FilterTypes'

  defineProps<{
    filteredTransactions: FilteredTransactions
  }>();


</script>
