<template>
    <div>
        <v-toolbar>
            <v-btn flat :to="{ path: '/accounts/new' }">New Account</v-btn>
        </v-toolbar>
        <div class="ma-5">
            <div>
                <account-tile
                    v-for="account in accounts"
                    :key="account.accountId"
                    :account="account"
                ></account-tile>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup lang="ts">
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import { computed } from 'vue'
    import AccountTile from '@/components/accountsManagement/BdgAccountTile.vue'

    const bankAccountStore = useBankAccountsStore()

    const accounts = computed(() => {
        return Object.values(bankAccountStore.accounts)
    })
</script>
