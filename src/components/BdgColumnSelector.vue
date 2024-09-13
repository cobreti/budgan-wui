<template>
  <div class="d-flex flex-row justify-start align-content-space-evenly selector">
    <div
      v-if="showClearSelection"
      class="column-cell"
      @click="onSelectCell(-1)">
    </div>
    <div v-for="(n, index) in columnsCount"
         :key="index"
         class="column-cell"
         :class="{ 'selected-cell': index === selectedColumn }"
         :title="columnsText ? columnsText[index] : ''"
          @click="onSelectCell(index)">
      <div>
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .selector {
    border: 1px dotted black;
    width: 100%;
    height: 100%;
    display: block;
  }

  .column-cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    border: 1px solid black;
    width: 100%;
    height: 100%;

    > div {
      display: block;
      text-align: center;
    }
  }

  .column-cell[title]:hover::after {
    content: attr(title);
    position: absolute;
    transform: translateY(-100%);
    background-color: rgba(var(--v-theme-secondary));
    color: white;
    padding: 0.5em;
    border-radius: 0.5em;
    z-index: 1000;
  }

  .selected-cell {
    background-color: rgba(var(--v-theme-secondary));
  }
</style>

<script setup lang="ts">

  import { computed } from 'vue'

  const emit = defineEmits(['column-selected', 'column-selection-cleared']);

  const selectedColumn = defineModel('selectedColumn', {
    type: Number,
    default: -1
  });

  const props = defineProps<{
    columnsCount: number,
    showClearSelection?: boolean,
    columnsText?: string[]
  }>();

  // const selectedColumn : Ref<number> = ref(-1);
  const showClearSelection = computed(() => {
    return props.showClearSelection || false;
  });

  const columnsCount = computed(() => {
    const v = Number(props.columnsCount);
    if (v > 20) {
      return 20;
    }
    if (v < 1) {
      return 1;
    }
    return v;
  })

  function onSelectCell(index: number) {
    selectedColumn.value = index;

    if (index == -1) {
      emit('column-selection-cleared');
    }
    else {
      // selectedColumnModel.value = index;
      emit('column-selected', index);
    }
  }

</script>

