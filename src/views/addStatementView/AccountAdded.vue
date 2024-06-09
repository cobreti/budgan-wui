<template>
  <div class="ma-4 pb-2 w-100">
    {{accountId}}
    <div class="separator mt-4 ml-lg-10 w-25"></div>
  </div>
</template>

<style scoped>
  .separator {
    border-bottom: 1px dotted gray;
  }
</style>


<script setup lang="ts">

  import { computed } from 'vue'
  import { useAddStatementStore } from '@/stores/add-statement-store'

  const props = defineProps<{
    accountId: string
  }>();

  const addStatementStore = useAddStatementStore();

  const accountGroup = computed(() => {
    return addStatementStore.accountsGroupedById[props.accountId];
  });

  const transactionsGroups = computed(() => {
    return Object.values(accountGroup.value)
      .reduce((acc: any[], curr) => {
        const transactions = curr.account.transactions.flat()
          .map((group: any) => ({
            ...group,
            filename: curr.filename
          }));

        return [...acc, ...transactions];
      }, []);
  });

</script>

