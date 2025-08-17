<template>
    <div class="csv-settings-page">
        <v-toolbar flat class="settings-toolbar" color="primary" dark>
            <v-btn icon @click="goBack" title="Back to Settings" class="me-2">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-toolbar-title>CSV Settings</v-toolbar-title>
        </v-toolbar>
        <v-container class="csv-settings-container">
            <v-row>
                <v-col cols="12">
                    <BdgCsvSettingsMgnt></BdgCsvSettingsMgnt>
                    <!-- <BdgCsvColumnsSettings></BdgCsvColumnsSettings> -->
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import BdgCsvSettingsMgnt from '@/components/settings/csvSettings/BdgCsvSettingsMgnt.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
function goBack() {
    router.push('/settings')
}
</script>

<style scoped>
.csv-settings-page {
    display: flex;
    flex-direction: column;
    max-width: 1000px;
    margin: 0 auto;
}
.settings-toolbar {
    background: var(--v-theme-primary);
    color: #fff;
    box-shadow: none;
    padding-left: 0;
}
.csv-settings-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
    padding-top: 2rem;
}
</style>
