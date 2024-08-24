<template>
  <div class="d-flex flex-column align-content-start h-100">
    <account-header :bank-account="account">
        <v-btn
          flat
          :to="{path: 'add-statement', replace: true}">
          <v-icon
            size="24"
            icon="mdi-file-upload-outline"></v-icon>
          add statement
        </v-btn>
    </account-header>
    <div class="transactions-list-container ma-2 pa-2">
      <div class="transactions-list">
        <account-view-transaction-list :transactions=transactions></account-view-transaction-list>
      </div>
    </div>
    <v-footer class="footer" elevation="2">
      {{ transactions.length }} transactions
    </v-footer>
  </div>
</template>

<style scoped>
  .footer {
    max-height: 2em;
  }

  .transactions-list-container {
    flex: 1 1 0;
    display: block;
    overflow: hidden;
  }

  .transactions-list {
    display: block;
    position: relative;
    overflow: auto;
    height: 100%;
    padding-bottom: 1em;
  }
</style>

<script setup lang="ts">

  import AccountViewTransactionList from '@components/accountView/AccountViewTransactionList.vue'
  import AccountHeader from '@views/account/account-header.vue'
  import { onBeforeRouteLeave, useRoute } from 'vue-router'
  import { useBankAccountsStore } from '@/stores/bankAccounts-store'
  import { useAccountViewStore } from '@/stores/accountView-store'
  import { computed, watchEffect } from 'vue'

  // const router = useRouter();
  const bankAccountStore = useBankAccountsStore();
  const accountViewStore = useAccountViewStore();

  const route = useRoute();

  const accountId = computed(() => {
    return route.params.id as string;
  });

  const account = computed(() => {
    return bankAccountStore.getAccountById(accountId.value);
  });

  const transactions = computed(() => {
    return accountViewStore.accountView.transactions;
  });

  watchEffect(() => {
    accountViewStore.addBankAccount(account.value);
  });

  onBeforeRouteLeave((to, from, next) => {
    accountViewStore.clearAccountView();
    next();
  });

</script>
