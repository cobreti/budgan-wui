<template>
  <div class="global-settings">
    <v-toolbar flat class="settings-toolbar" color="primary" dark>
      <v-btn icon @click="goBack" title="Back to Settings" class="me-2">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-toolbar-title>Global Settings</v-toolbar-title>
    </v-toolbar>
    <v-container class="settings-content">
      <v-card class="pa-4">
        <v-card-text>
          <!-- Add global settings controls here -->
          <p>This is a placeholder for global application settings.</p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goBack() {
  router.push('/settings')
}
</script>

<style scoped>
.global-settings {
  max-width: 1000px;
  margin: 0 auto;
}
.settings-toolbar {
  background: var(--v-theme-primary);
  color: #fff;
  box-shadow: none;
  padding-left: 0;
}
.settings-content {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 2rem;
}
</style>
