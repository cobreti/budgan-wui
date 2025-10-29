<template>
    <main>
        <v-container class="account-container">
            <v-row>
                <v-col cols="12">
                    <v-toolbar color="primary">
                        <v-btn flat :to="{ path: '/accounts/new' }">New Account</v-btn>
                    </v-toolbar>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <div>
                        <account-tile
                            v-for="account in accounts"
                            :key="account.accountId"
                            :account="account"
                        ></account-tile>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </main>
</template>

<style scoped>
    .account-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
</style>

<script setup lang="ts">
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import { computed } from 'vue'
    import AccountTile from '@/components/accountsManagement/BdgAccountTile.vue'

    const bankAccountStore = useBankAccountsStore()

    const accounts = computed(() => {
        return Object.values(bankAccountStore.accounts)
    })
</script>
