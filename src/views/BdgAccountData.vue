<template>
    <div>
        <v-tabs v-model="activeTab" bg-color="primary">
            <v-tab value="export">Export</v-tab>
            <v-tab value="import">Import</v-tab>
        </v-tabs>
        
        <v-window v-model="activeTab">
            <v-window-item value="export">
                <BdgExportAccountData v-if="bankAccountsStore.hasAccounts" />
                <v-alert
                    v-else
                    type="info"
                    class="mt-4"
                >
                    You need to have accounts to export data. Please create or import accounts first.
                </v-alert>
            </v-window-item>
            <v-window-item value="import">
                <BdgImportAccountData />
            </v-window-item>
        </v-window>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import BdgExportAccountData from './BdgExportAccountData.vue';
import BdgImportAccountData from './BdgImportAccountData.vue';
import { useBankAccountsStore } from '@/stores/bankAccounts-store';
import { useRoute, useRouter } from 'vue-router';

const bankAccountsStore = useBankAccountsStore();
const route = useRoute();
const router = useRouter();

const activeTab = ref('import'); // Default to import tab if no accounts exist

// Set active tab based on query parameter
onMounted(() => {
    if (route.query.tab === 'export' && bankAccountsStore.hasAccounts) {
        activeTab.value = 'export';
    } else {
        activeTab.value = 'import';
    }
});

// Update URL when tab changes
watch(activeTab, (newTab) => {
    router.replace({
        query: {
            ...route.query,
            tab: newTab
        }
    });
});
</script>
