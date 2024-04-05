<template>
  <div>
    <v-navigation-drawer :fullHeight="true" v-model="props.showDrawer">
      <v-list-item title="Home" :to="{path: '/'}"></v-list-item>
      <v-list-item title="Add statement" :to="{path: '/add-statement'}"></v-list-item>
      <v-list-item title="Accounts">
        <nd-accounts-list class="mt-2"></nd-accounts-list>
      </v-list-item>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
  import ndAccountsList from './navigationDrawer/ndAccountsList.vue';

  let props = defineProps({
    showDrawer: {
      type: Boolean,
      default: false
    }
  });
</script>
