<template>
    <div>
        <v-toolbar class="pl-5">
            <a v-if="showBackButton" @click="navigateBack">
                <v-icon size="Large" icon="mdi-chevron-left"></v-icon>
            </a>
            <v-toolbar-title :class="{ 'ml-2': showBackButton }">Settings</v-toolbar-title>
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
    import { computed } from 'vue'

    const router = useRouter()
    const route = useRoute()

    // Use the navigation source to determine if we should show the back button
    const showBackButton = computed(() => {
        // Don't show back button if we came from the sidebar navigation
        if (route.query.from === 'sidebar-nav') {
            return false
        }

        // For any other navigation, show the back button
        // This includes:
        // 1. Navigation with a specific 'from' parameter (like newAccount)
        // 2. Regular browser navigation (back/forward)
        // 3. Direct links from other parts of the app
        return true
    })

    function navigateBack() {
        // Check if came from new account page
        if (route.query.from === 'newAccount') {
            router.push('/accounts/new')
        }
        // If we came from anywhere else with a from parameter
        else if (typeof route.query.from === 'string' && route.query.from !== 'sidebar-nav') {
            // Try to navigate to the source page if possible
            router.push('/' + route.query.from)
        }
        // Otherwise just go back in history
        else {
            router.go(-1)
        }
    }
</script>
