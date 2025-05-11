<template>
    <div class="d-flex flex-column align-content-start h-100" v-if="account">
        <account-header :bank-account="account">
            <v-btn flat :to="{ path: 'add-statement', replace: true }">
                <v-icon size="24" icon="mdi-file-upload-outline"></v-icon>
                add statement
            </v-btn>
        </account-header>
        <div class="transactions-list-container ma-2 pa-2">
            <div class="transactions-list">
                <account-view-transaction-list
                    :transactions="transactions"
                ></account-view-transaction-list>
            </div>
        </div>
        <v-footer class="footer" elevation="2"> {{ transactions.length }} transactions </v-footer>
    </div>
</template>

<style scoped>
    .footer {
        max-height: 2em;
    }

    .transactions-list-container {
        flex: 1 1 0;
        display: block;
        overflow: hidden;
    }

    .transactions-list {
        display: block;
        position: relative;
        overflow: auto;
        height: 100%;
        padding-bottom: 1em;
    }
</style>

<script setup lang="ts">
    import AccountViewTransactionList from '@components/accountView/BdgAccountViewTransactionList.vue'
    import AccountHeader from '@views/account/BdgAccountHeader.vue'
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
