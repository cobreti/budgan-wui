<template>
    <div>
        <v-card class="d-flex flex-column ma-2 pa-2">
            <div class="mb-4">
                <h3>Clear Application Data</h3>
                <p class="text-body-2 mt-2">
                    This will remove all your stored data including accounts, transactions, and
                    settings. This action cannot be undone.
                </p>
            </div>

            <v-divider class="mb-4"></v-divider>

            <div class="d-flex flex-column">
                <v-checkbox
                    v-model="clearAccounts"
                    label="Clear bank accounts and transactions"
                    hint="Removes all your accounts and their transaction data"
                    persistent-hint
                    class="mb-2"
                ></v-checkbox>

                <v-checkbox
                    v-model="clearCsvSettings"
                    label="Clear CSV import settings"
                    hint="Removes all saved CSV import configurations"
                    persistent-hint
                    class="mb-2"
                ></v-checkbox>

                <v-checkbox
                    v-model="clearAppSettings"
                    label="Clear application settings"
                    hint="Resets all application preferences to default"
                    persistent-hint
                ></v-checkbox>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="d-flex flex-row justify-center">
                <v-btn
                    color="error"
                    :disabled="!canClear"
                    @click="clearStorageData"
                    prepend-icon="mdi-delete"
                >
                    Clear Selected Data
                </v-btn>
            </div>

            <v-snackbar v-model="showSnackbar" :timeout="3000" color="success">
                Selected data has been cleared successfully!
            </v-snackbar>
        </v-card>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import { useCsvSettingsStore } from '@/stores/csvSettings-store'
    import { useAppSettingsStore } from '@/stores/appSettings-store'

    // Stores
    const bankAccountsStore = useBankAccountsStore()
    const csvSettingsStore = useCsvSettingsStore()
    const appSettingsStore = useAppSettingsStore()

    // State
    const clearAccounts = ref(true)
    const clearCsvSettings = ref(false)
    const clearAppSettings = ref(false)
    const showSnackbar = ref(false)

    // Enable clear button only if at least one option is selected
    const canClear = computed(() => {
        return clearAccounts.value || clearCsvSettings.value || clearAppSettings.value
    })

    // Function to clear the selected storage data
    function clearStorageData() {
        if (clearAccounts.value) {
            bankAccountsStore.clear()
        }

        if (clearCsvSettings.value) {
            // Clear all CSV settings by removing each setting
            const settingsToRemove = [...csvSettingsStore.settings]
            settingsToRemove.forEach((setting) => {
                csvSettingsStore.removeSetting(setting.id)
            })
        }

        if (clearAppSettings.value) {
            // Reset app settings to default values
            const currentVersion = appSettingsStore.appSettings.version
            appSettingsStore.setVersion(currentVersion) // Keep current version
            // Set drawer to default
            appSettingsStore.appSettings = {
                drawerVisible: true,
                version: currentVersion
            }
        }

        // Show success message
        showSnackbar.value = true
    }
</script>

<style scoped></style>
