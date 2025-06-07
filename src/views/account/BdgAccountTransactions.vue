<template>
    <div v-if="account" class="transaction-page">
        <v-container class="account-container">
            <account-header :bank-account="account">
                <v-btn flat :to="{ path: 'monthly-transactions' }" class="mr-2">
                    <v-icon size="24" icon="mdi-calendar-month"></v-icon>
                    monthly view
                </v-btn>
                <v-btn flat :to="{ path: 'add-statement', replace: true }">
                    <v-icon size="24" icon="mdi-file-upload-outline"></v-icon>
                    add statement
                </v-btn>
            </account-header>

            <div class="transactions-list-container ma-2">
                <account-view-transaction-list
                    :transactions="transactions"
                ></account-view-transaction-list>
            </div>
        </v-container>
    </div>
</template>

<style scoped>
    .transaction-page {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 64px); /* Subtract app bar height */
    }

    .account-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
        display: flex;
        flex-direction: column;
        height: 100%;
        flex: 1;
    }

    .transactions-list-container {
        flex: 1 1 auto;
        min-height: 300px;
    }
</style>

<script setup lang="ts">
    import AccountViewTransactionList from '@components/accountView/BdgAccountViewTransactionList.vue'
    import AccountHeader from '@/components/account/BdgAccountHeader.vue'
    import { onBeforeRouteLeave, useRoute } from 'vue-router'
    import { useAccountViewStore } from '@/stores/accountView-store'
    import { computed, watchEffect } from 'vue'

    const accountViewStore = useAccountViewStore()

    const route = useRoute()

    const accountId = computed(() => {
        return route.params.id as string
    })

    const account = computed(() => {
        return accountViewStore.accountView.account
    })

    const transactions = computed(() => {
        return accountViewStore.accountView.transactions
    })

    watchEffect(() => {
        if (accountId.value) {
            accountViewStore.setBankAccountFromId(accountId.value)
        } else {
            accountViewStore.clearAccountView()
        }
    })

    onBeforeRouteLeave((to, from, next) => {
        accountViewStore.clearAccountView()
        next()
    })
</script>
