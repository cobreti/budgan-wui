<template>
  <div>
    <div class="selector-container">
      <bdg-column-selector :columns-count="15" show-clear-selection @column-selected="onColumnSelected" @column-selection-cleared="onColumnSelectionCleared"/>
    </div>
  </div>
</template>

<style scoped>
  .selector-container {
    display: block;
    width: 50%;
    height: 2em;
    margin: 2em;
  }
</style>

<script setup lang="ts">
  import BdgColumnSelector from '@components/BdgColumnSelector.vue'

  function onColumnSelected(index: number) {
    console.log(`Column ${index} selected`);
  }

  function onColumnSelectionCleared() {
    console.log('Column selection cleared');
  }
</script>

