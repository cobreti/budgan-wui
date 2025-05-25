<template>
    <v-card class="monthly-block mb-6" elevation="2">
        <v-card-title class="d-flex justify-space-between align-center">
            <div>
                <h2 class="text-h5">{{ formatMonthYear(monthKey) }}</h2>
            </div>
            <div
                class="text-subtitle-1"
                :class="{
                    'text-success': monthData.balance > 0,
                    'text-error': monthData.balance < 0
                }"
            >
                Balance: {{ formatAmount(monthData.balance) }}
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <v-row class="transactions-columns ma-0">
                <v-col cols="6" class="income-column pa-4">
                    <bdg-monthly-transaction-list
                        :transactions="monthData.income"
                        title="Income"
                        :total="monthData.totalIncome"
                        :is-income="true"
                    ></bdg-monthly-transaction-list>
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="6" class="expense-column pa-4">
                    <bdg-monthly-transaction-list
                        :transactions="monthData.expense"
                        title="Expenses"
                        :total="monthData.totalExpense"
                        :is-income="false"
                    ></bdg-monthly-transaction-list>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<style scoped>
    .monthly-block {
        width: 100%;
    }

    .transactions-columns {
        min-height: 300px;
        max-height: 500px;
    }

    .income-column,
    .expense-column {
        height: 100%;
        overflow: hidden;
    }
</style>

<script setup lang="ts">
    import BdgMonthlyTransactionList from './BdgMonthlyTransactionList.vue'
    import type { MonthTransactions } from '@/stores/accountview/monthly-account-view-store'

    const props = defineProps<{
        monthKey: string
        monthData: MonthTransactions
    }>()

    // Format month and year from YYYY-MM format
    function formatMonthYear(yearMonth: string): string {
        const [year, month] = yearMonth.split('-')
        const date = new Date(parseInt(year), parseInt(month) - 1)

        return date.toLocaleString('default', { month: 'long', year: 'numeric' })
    }

    // Format currency amount
    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount)
    }
</script>
