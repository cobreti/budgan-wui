<template>
    <div class="monthly-transactions">
        <h3 class="text-subtitle-1 font-weight-bold mb-2">{{ title }}</h3>
        <div class="total-amount" :class="{ income: isIncome, expense: !isIncome }">
            {{ formatAmount(total) }}
        </div>
        <v-divider class="my-2"></v-divider>
        <div class="transactions-list">
            <div
                v-for="transaction in transactions"
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
                <v-divider class="my-1"></v-divider>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .monthly-transactions {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .transactions-list {
        flex: 1;
        overflow-y: auto;
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

    // Format date
    function formatDate(date: Date): string {
        return date.toLocaleDateString()
    }
</script>
