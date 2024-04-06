<template>
  <div>
    <v-btn
      :href="accountsDataObjecTUrl"
      :download="filename"
      >Download data</v-btn>
  </div>
</template>

<style scoped>
</style>


<script setup lang="ts">

  import { useBankAccountsStore } from '@/stores/bankAccounts-store'
  import { computed } from 'vue'

  const store = useBankAccountsStore();

  const filename = "test-2.json"

  const accountsDataObjecTUrl = computed(() => {
    const json = JSON.stringify(store.accounts);
    const blob = new Blob([json], { type: 'application/json' });
    return URL.createObjectURL(blob);
  });

</script>
