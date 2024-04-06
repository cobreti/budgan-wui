<template>
  <div>
    <v-navigation-drawer :fullHeight="true" v-model="drawerVisible">
      <v-list-item title="Home" :to="{path: '/'}"></v-list-item>
      <v-list-item title="Add statement" :to="{path: '/add-statement'}"></v-list-item>
      <v-list-item title="Accounts">
        <nd-accounts-list class="mt-2"></nd-accounts-list>
      </v-list-item>
      <v-list-item title="export" :to="{path: '/export'}"></v-list-item>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
  import ndAccountsList from './navigationDrawer/ndAccountsList.vue';
  import { useAppSettingsStore } from '@/stores/appSettings-store'
  import { computed } from 'vue'

  const appSettingsStore = useAppSettingsStore();

  let drawerVisible = computed(() => {
    return appSettingsStore.appSettings.drawerVisible;
  })



</script>
