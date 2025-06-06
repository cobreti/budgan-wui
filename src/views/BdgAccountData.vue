<template>
    <main>
        <v-container class="account-container">
            <v-tabs v-model="activeTab" bg-color="primary">
                <v-tab value="save">Save</v-tab>
                <v-tab value="load">Load</v-tab>
                <v-tab value="clear">Clear Data</v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
                <v-window-item value="save">
                    <BdgSaveAccountData v-if="bankAccountsStore.hasAccounts" />
                    <v-alert v-else type="info" class="mt-4">
                        You need to have accounts to save data. Please create or load accounts
                        first.
                    </v-alert>
                </v-window-item>
                <v-window-item value="load">
                    <BdgLoadAccountData />
                </v-window-item>
                <v-window-item value="clear">
                    <BdgClearStorageData />
                </v-window-item>
            </v-window>
        </v-container>
    </main>
</template>

<script setup lang="ts">
    import { ref, watch, onMounted } from 'vue'
    import BdgSaveAccountData from './BdgSaveAccountData.vue'
    import BdgLoadAccountData from './BdgLoadAccountData.vue'
    import BdgClearStorageData from './BdgClearStorageData.vue'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import { useRoute, useRouter } from 'vue-router'

    const bankAccountsStore = useBankAccountsStore()
    const route = useRoute()
    const router = useRouter()

    const activeTab = ref('load') // Default to load tab if no accounts exist

    // Set active tab based on query parameter
    onMounted(() => {
        if (route.query.tab === 'save' && bankAccountsStore.hasAccounts) {
            activeTab.value = 'save'
        } else if (route.query.tab === 'clear') {
            activeTab.value = 'clear'
        } else {
            activeTab.value = 'load'
        }
    })

    // Update URL when tab changes
    watch(activeTab, (newTab) => {
        router.replace({
            query: {
                ...route.query,
                tab: newTab
            }
        })
    })
</script>

<style scoped>
    .account-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
</style>
