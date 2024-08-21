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
        <div>
          <v-btn
            flat
            :to="{path: 'add-statement', replace: true}"
            @click="addStatement">
            <v-icon
              size="24"
              icon="mdi-file-upload-outline"></v-icon>
            add statement
          </v-btn>
        </div>
        <div class="mr-4 ml-4">
          <span class="font-weight-bold">account : </span>
          <span class="pl-2">{{accountId}}</span>
        </div>
      </div>
    </v-toolbar>
    <router-view name="accountroutes"></router-view>
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

</style>


<script setup lang="ts">
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import {computed, watchEffect} from 'vue';
  import {useBankAccountsStore} from '@/stores/bankAccounts-store';
  import {useAccountViewStore} from '@/stores/accountView-store';

  const router = useRouter();
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

  function addStatement() {

  }

</script>
