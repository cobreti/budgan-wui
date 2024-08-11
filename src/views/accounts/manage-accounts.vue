<template>
  <div>
    <v-toolbar>
      <v-btn flat :to="{path: '/accounts/new'}">New Account</v-btn>
    </v-toolbar>
    <div class="ma-5">
      <h1>Accounts</h1>
      <ul>
        <li v-for="account in accounts" :key="account.accountId">
          <v-card>
            <v-card-title>{{account.accountId}}</v-card-title>
            <v-card-text>{{account.name}}</v-card-text>
          </v-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
</style>

<script setup lang="ts">

  import { useBankAccountsStore } from '@/stores/bankAccounts-store'
  import { computed } from 'vue'

  const bankAccountStore = useBankAccountsStore();

  const accounts = computed(() => {
    return Object.values(bankAccountStore.accounts);
  });

</script>
