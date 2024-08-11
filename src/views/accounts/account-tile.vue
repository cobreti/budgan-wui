<template>
  <v-card class="ma-10">
    <v-card-title class="cursor-default">{{props.account.name}}</v-card-title>
    <v-card-text class="cursor-default">
      <div class="d-flex flex-row">
        <div class="info-span">{{props.account.accountId}}</div>
        <div class="info-span">{{props.account.accountType}}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
  .cursor-default {
    cursor: default;
  }

  .info-span {
    margin-right: 1em;
    width: 20em;
  }
</style>

<script setup lang="ts">

  import { type BankAccount } from '@models/BankAccountTypes'

  const props = defineProps<{
    account: BankAccount
  }>();


</script>
