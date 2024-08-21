<template>
<!--  <div class="w-100">-->
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{accountId}}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="">
          <div class="d-flex flex-row flex-wrap align-content-space-evenly">
            <v-card class="trans-group" v-for="group in transactionsGroups" :key="group.id">
              <div class="line-content">
                <span class="title">Filename :</span>
                <span class="content">{{group.filename}}</span>
              </div>
              <div class="line-content">
                <span class="title">Date :</span>
                <span class="content">{{group.dateStart.toDateString()}} - {{group.dateEnd.toDateString()}}</span>
              </div>
              <div class="line-content">
                <span class="title">transactions count :</span>
                <span class="content">{{group.transactions.length}}</span>
              </div>
              <div class="line-content" v-if="group.invalidTransactions != undefined && group.invalidTransactions.length > 0">
                <span class="title">ignored transactions :</span>
                <span class="content">{{group.invalidTransactions.length}}</span>
              </div>
            </v-card>
          </div>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
<!--  </div>-->
</template>

<style scoped>
  .line-content {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    font-size: 90%;
    cursor: default;
  }

  .title {
    font-weight: bold;
    margin-right: 1em;
    min-width: 12em;
  }

  .content {
    font-weight: normal;
  }

  .trans-group {
    display: block;
    position: relative;
    overflow: auto;
    width: 45%;
    margin: 1em;
    padding: 1em;
  }
</style>


<script setup lang="ts">
  import { computed } from 'vue'
  import { useAddStatementStore } from '../../stores/add-statement-store'

  const props = defineProps<{
    accountId: string
  }>();

  const addStatementStore = useAddStatementStore();

  const transactionsGroups = computed(() => {
    return addStatementStore.accounts[props.accountId].transactionsGroups;
  });

</script>

