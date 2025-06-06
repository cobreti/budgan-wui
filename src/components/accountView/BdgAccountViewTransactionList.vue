<template>
    <v-table height="100%" fixed-header class="transaction-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="transaction in props.transactions"
                :key="transaction.transactionId"
                class="transaction"
            >
                <td>{{ formatDate(transaction.dateInscription) }}</td>
                <td>{{ transaction.type }}</td>
                <td>{{ transaction.description }}</td>
                <td class="text-right">{{ transaction.amount }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<style scoped>
    .transaction-table {
        height: 100%;
        overflow: auto;
    }

    /* Column sizing */
    :deep(.v-table) {
        table-layout: fixed;
    }

    :deep(th:nth-child(1)),
    :deep(td:nth-child(1)) {
        width: 15%;
    }

    :deep(th:nth-child(2)),
    :deep(td:nth-child(2)) {
        width: 15%;
    }

    :deep(th:nth-child(3)),
    :deep(td:nth-child(3)) {
        width: 50%;
    }

    :deep(th:nth-child(4)),
    :deep(td:nth-child(4)) {
        width: 20%;
    }

    :deep(.text-right) {
        text-align: right;
    }

    .transaction:nth-child(odd) {
        background-color: rgba(var(--v-theme-on-surface-variant));
    }
</style>

<script setup lang="ts">
    import 'vuetify/styles'
    import type { AccountViewTransaction } from '@/stores/accountView-store'

    const props = defineProps<{
        transactions: AccountViewTransaction[]
    }>()

    /**
     * Format date to local time
     */
    function formatDate(date: Date): string {
        return date.toLocaleDateString()
    }
</script>
