<template>
    <div class="monthly-transactions">
        <div class="transaction-header">
            <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ title }}</h3>
            <div class="total-amount" :class="{ income: isIncome, expense: !isIncome }">
                {{ formatAmount(total) }}
            </div>
            <v-divider class="my-2"></v-divider>
        </div>
        <div class="transactions-list">
            <div
                v-for="(transaction, index) in transactions"
                :key="transaction.transactionId"
                class="transaction-item pa-2"
            >
                <div class="d-flex justify-space-between align-center">
                    <div class="transaction-date">
                        {{ formatDate(transaction.dateInscription) }}
                    </div>
                    <div
                        class="transaction-amount"
                        :class="{ income: isIncome, expense: !isIncome }"
                    >
                        {{ formatAmount(transaction.amount) }}
                    </div>
                </div>
                <div class="transaction-description text-body-2 text-truncate">
                    {{ transaction.description }}
                </div>
                <v-divider class="my-1" v-if="index < transactions.length - 1"></v-divider>
            </div>
            <!-- Empty div to ensure padding at the bottom of the list -->
            <div class="pb-4"></div>
        </div>
    </div>
</template>

<style scoped>
    .monthly-transactions {
        height: 100%;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .transaction-header {
        flex: 0 0 auto;
    }

    .transactions-list {
        flex: 1 1 auto;
        overflow-y: auto;
        padding-bottom: 4px;
        margin-bottom: 8px; /* Extra space to ensure the last item is visible */
    }

    .transaction-item {
        transition: background-color 0.2s;
    }

    .transaction-item:hover {
        background-color: rgba(var(--v-theme-on-surface), 0.04);
    }

    .transaction-date {
        color: rgba(var(--v-theme-on-surface), 0.7);
        font-size: 0.85rem;
    }

    .transaction-amount {
        font-weight: bold;
    }

    .income {
        color: rgb(76, 175, 80);
    }

    .expense {
        color: rgb(244, 67, 54);
    }

    .total-amount {
        font-weight: bold;
        font-size: 1.2rem;
        text-align: right;
    }
</style>

<script setup lang="ts">
    import type { BankAccountTransaction } from '@models/BankAccountTypes'

    const props = defineProps<{
        transactions: BankAccountTransaction[]
        title: string
        total: number
        isIncome: boolean
    }>()

    // Format currency amount
    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(Math.abs(amount))
    }

    // Use props to silence TypeScript warnings
    const { transactions, title, total, isIncome } = props

    // Format date
    function formatDate(date: Date): string {
        return date.toLocaleDateString()
    }
</script>
