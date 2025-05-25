<template>
    <div>
        <v-navigation-drawer :fullHeight="true" v-model="drawerVisible">
            <v-list-item
                title="Home"
                :to="{ path: '/', replace: true, query: { from: 'sidebar-nav' } }"
            ></v-list-item>
            <v-list-item
                title="Accounts"
                :to="{ path: '/accounts', replace: true, query: { from: 'sidebar-nav' } }"
            ></v-list-item>
            <v-list-item
                title="Data"
                :to="{ 
                    path: '/account-data', 
                    replace: true, 
                    query: { 
                        from: 'sidebar-nav',
                        tab: bankAccountsStore.hasAccounts ? 'export' : 'import'
                    } 
                }"
            ></v-list-item>
            <v-list-item
                title="Settings"
                :to="{ path: '/settings', replace: true, query: { from: 'sidebar-nav' } }"
            ></v-list-item>
        </v-navigation-drawer>
    </div>
</template>

<script setup lang="ts">
    import { useAppSettingsStore } from '@/stores/appSettings-store'
    import { computed } from 'vue'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'

    const appSettingsStore = useAppSettingsStore()
    const bankAccountsStore = useBankAccountsStore()

    let drawerVisible = computed(() => {
        return appSettingsStore.appSettings.drawerVisible
    })
</script>
