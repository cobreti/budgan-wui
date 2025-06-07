<template>
    <div class="csv-settings-page">
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

<style scoped>
    .csv-settings-page {
        display: flex;
        flex-direction: column;
    }

    .csv-settings-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem;
    }
</style>

<script setup lang="ts">
    import BdgCsvSettingsMgnt from '@/components/settings/csvSettings/BdgCsvSettingsMgnt.vue'
    // import BdgCsvColumnsSettings from './BdgCsvColumnsSettings.vue'
</script>
