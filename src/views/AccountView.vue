<template>
  <div class="d-flex flex-column align-content-start h-100">
    <v-toolbar>
      <div class="dflex w-100 flex-row flex-content justify-space-between">
        <div class="ml-4 mr-4">
          <a @click="$router.go(-1)">
            <v-icon
              size="Large"
              icon="mdi-chevron-left"></v-icon>
          </a>
        </div>
        <div class="mr-4 ml-4">
          <span class="font-weight-bold">account : </span>
          <span class="pl-2">{{accountId}}</span>
        </div>
      </div>
    </v-toolbar>
    <div class="transactions-list-container ma-2 pa-2">
      <div class="transactions-list">
        <account-view-transaction-list></account-view-transaction-list>
      </div>
    </div>
  </div>
</template>


<style scoped>

  .flex-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .filter-panel {
    display: block;
    position: relative;
    height: 50%;
  }

  .drop-down-icon {
    font-size: 28pt
  }

  .account-header {
    display: block;
    position: relative;
    /* min-height: 3em; */
  }

  .transactions-list-container {
    flex: 1 1 0;
    display: block;
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .transactions-list {
    display: block;
    position: relative;
    overflow: auto;
    height: 100%;
  }
</style>


<script setup lang="ts">
  import {onBeforeRouteLeave, useRoute} from 'vue-router';
  import {computed, watchEffect} from 'vue';
  import {useBankAccountsStore} from '@/stores/bankAccounts-store';
  import {useAccountViewStore} from '@/stores/accountView-store';
  import AccountViewTransactionList from '@components/accountView/AccountViewTransactionList.vue';

  const bankAccountStore = useBankAccountsStore();
  const accountViewStore = useAccountViewStore();

  const route = useRoute();

  const accountId = computed(() => {
    return route.params.id as string;
  });

  const account = computed(() => {
    return bankAccountStore.getAccountById(accountId.value);
  });

  watchEffect(() => {
    accountViewStore.addBankAccount(account.value);
  });

  onBeforeRouteLeave((to, from, next) => {
    accountViewStore.clearAccountView();
    next();
  });

</script>
