<template>
  <div class="d-flex flex-column align-content-start h-100">
    <v-card class="account-header mt-2 ml-2 mr-2 mb-1 pa-2">
      <div>
        <span class="font-weight-bold">account : </span>
        <span class="pl-2">{{accountId}}</span>
      </div>
    </v-card>

    <v-card class="d-flex flex-row justify-end ml-2 mr-2 pt-2 pb-2">
      <v-btn @click="onFilterButtonClicked">
        Filters
        <v-icon class="drop-down-icon ml-2" :icon="iconName" size="large"></v-icon>
      </v-btn>
      <div class="filter-panel">

      </div>
    </v-card>

    <v-card class="transactions-list-container ma-2 pa-2">
      <div class="transactions-list">
        <account-view-transaction-list></account-view-transaction-list>
      </div>
    </v-card>
  </div>
</template>


<style scoped>

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

  const iconName = "mdi-menu-down"

  function onFilterButtonClicked() {

  }

  watchEffect(() => {
    accountViewStore.addBankAccount(account.value);
  });

  onBeforeRouteLeave((to, from, next) => {
    accountViewStore.clearAccountView();
    next();
  });

</script>
