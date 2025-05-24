<template>
    <div>
        <v-toolbar class="pl-5">
            <a @click="navigateBack">
                <v-icon size="Large" icon="mdi-chevron-left"></v-icon>
            </a>
            <v-toolbar-title class="ml-2">Settings</v-toolbar-title>
        </v-toolbar>
        <bdg-csv-settings></bdg-csv-settings>
    </div>
</template>

<style scoped>
    a {
        cursor: pointer;
    }
</style>

<script setup lang="ts">
    import BdgCsvSettings from '@/views/settings/csvSettings/BdgCsvSettings.vue'
    import { useRoute, useRouter } from 'vue-router'

    const router = useRouter()
    const route = useRoute()

    function navigateBack() {
        // Check if came from new account page
        if (route.query.from === 'newAccount') {
            router.push('/accounts/new')
        } else {
            router.go(-1)
        }
    }
</script>
