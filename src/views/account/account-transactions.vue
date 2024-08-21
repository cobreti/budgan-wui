<template>
  <div lass="d-flex flex-column align-content-start h-100">
    <account-header>
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
        <account-view-transaction-list></account-view-transaction-list>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

  import AccountViewTransactionList from '@components/accountView/AccountViewTransactionList.vue'
  import AccountHeader from '@views/account/account-header.vue'
</script>
```