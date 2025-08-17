<template>
    <div class="csv-settings-page">
        <v-toolbar flat class="settings-toolbar" color="primary" dark>
            <div class="d-flex w-100 flex-row align-center justify-space-between">
                <div class="ml-4 d-flex flex-row align-center">
                    <div class="back-button mr-2">
                        <a @click="goBack" title="Back to Settings">
                            <v-icon size="large" icon="mdi-chevron-left"></v-icon>
                        </a>
                    </div>
                    <div class="header-title">
                        <div>CSV Settings</div>
                    </div>
                </div>
            </div>
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

.header-title {
    cursor: default;
    height: 100%;
    display: contents;
}

.header-title > div {
    font-weight: bold;
    align-content: center;
    margin-right: 1em;
}

.back-button {
    cursor: pointer;
}

.csv-settings-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 1rem;
    padding-top: 2rem;
}
</style>
