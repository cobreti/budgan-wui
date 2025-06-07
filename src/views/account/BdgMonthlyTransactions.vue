<template>
    <div v-if="account" class="transaction-page">
        <v-container class="account-container">
            <account-header :bank-account="account">
                <v-btn flat :to="{ path: 'transactions' }" class="mr-2">
                    <v-icon size="24" icon="mdi-view-list"></v-icon>
                    list view
                </v-btn>
                <v-btn flat :to="{ path: 'add-statement', replace: true }">
                    <v-icon size="24" icon="mdi-file-upload-outline"></v-icon>
                    add statement
                </v-btn>
            </account-header>

            <div class="monthly-view-container ma-2">
                <v-container fluid>
                    <v-row>
                        <v-col cols="12">
                            <h2 class="text-h4 mb-4">Monthly Transactions</h2>
                            <v-card class="summary-card mb-6" color="primary" theme="dark">
                                <v-card-text>
                                    <div class="d-flex justify-space-between align-center">
                                        <div>
                                            <div class="text-h6">Total Income</div>
                                            <div class="text-h4">
                                                {{ formatAmount(totalIncomeValue) }}
                                            </div>
                                        </div>
                                        <v-divider
                                            vertical
                                            class="mx-4"
                                            style="height: 50px"
                                        ></v-divider>
                                        <div>
                                            <div class="text-h6">Total Expenses</div>
                                            <div class="text-h4">
                                                {{ formatAmount(totalExpenseValue) }}
                                            </div>
                                        </div>
                                        <v-divider
                                            vertical
                                            class="mx-4"
                                            style="height: 50px"
                                        ></v-divider>
                                        <div>
                                            <div class="text-h6">Balance</div>
                                            <div
                                                class="text-h4"
                                                :class="{
                                                    'text-success': totalBalanceValue > 0,
                                                    'text-error': totalBalanceValue < 0
                                                }"
                                            >
                                                {{ formatAmount(totalBalanceValue) }}
                                            </div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <div v-if="monthKeys.length === 0" class="text-center py-12">
                        <v-icon icon="mdi-calendar-month" size="64" color="grey-lighten-1"></v-icon>
                        <div class="text-h5 mt-4 text-grey-darken-1">No transactions found</div>
                        <div class="text-body-1 text-grey-darken-1">
                            Upload a statement to see your monthly transactions
                        </div>
                    </div>

                    <template v-else>
                        <bdg-monthly-transaction-block
                            v-for="monthKey in monthKeys"
                            :key="monthKey"
                            :month-key="monthKey"
                            :month-data="getMonthData(monthKey)"
                        ></bdg-monthly-transaction-block>
                    </template>
                </v-container>
            </div>

            <div class="footer-container">
                <v-footer class="footer" elevation="2">
                    {{ totalMonths }} months · {{ totalTransactions }} transactions
                </v-footer>
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

    .footer-container {
        margin-top: auto;
        padding-top: 0.5rem;
    }

    .footer {
        height: 36px;
        display: flex;
        align-items: center;
    }

    .monthly-view-container {
        flex: 1 1 auto;
        overflow-y: auto;
        padding-bottom: 1rem;
        min-height: 300px;
    }

    .summary-card {
        transition: all 0.3s;
    }

    .summary-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
</style>

<script setup lang="ts">
    import AccountHeader from '@/components/account/BdgAccountHeader.vue'
    import BdgMonthlyTransactionBlock from '@/components/accountView/BdgMonthlyTransactionBlock.vue'
    import { useMonthlyAccountViewStore } from '@/stores/accountview/monthly-account-view-store'
    import { onBeforeRouteLeave, useRoute } from 'vue-router'
    import { computed, watchEffect } from 'vue'

    const monthlyViewStore = useMonthlyAccountViewStore()
    const route = useRoute()

    const accountId = computed(() => {
        return route.params.id as string
    })

    const account = computed(() => {
        return monthlyViewStore.monthlyView.account
    })

    const monthKeys = computed(() => {
        return monthlyViewStore.monthlyView.sortedMonthKeys
    })

    const totalTransactions = computed(() => {
        return monthlyViewStore.monthlyView.allTransactions.length
    })

    const totalMonths = computed(() => {
        return monthlyViewStore.monthlyView.sortedMonthKeys.length
    })

    const totalIncomeValue = computed(() => {
        return monthlyViewStore.totalIncome()
    })

    const totalExpenseValue = computed(() => {
        return monthlyViewStore.totalExpense()
    })

    const totalBalanceValue = computed(() => {
        return monthlyViewStore.monthBalance()
    })

    // Format currency amount
    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount)
    }

    // Get month data from store
    function getMonthData(monthKey: string) {
        return monthlyViewStore.getTransactionsByMonth(monthKey)!
    }

    watchEffect(() => {
        if (accountId.value) {
            monthlyViewStore.setBankAccountFromId(accountId.value)
        } else {
            monthlyViewStore.clearMonthlyView()
        }
    })

    onBeforeRouteLeave((to, from, next) => {
        monthlyViewStore.clearMonthlyView()
        next()
    })
</script>
