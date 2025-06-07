<template>
    <v-container fluid class="transaction-list-wrapper pa-0">
        <v-row>
            <v-col cols="12">
                <v-card class="transaction-card">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span>Transactions</span>
                        <span class="text-body-2"
                            >{{ props.transactions.length }} transactions</span
                        >
                    </v-card-title>
                    <v-divider></v-divider>
                    <div class="transaction-table-container">
                        <v-table density="compact" fixed-header class="transaction-table">
                            <thead>
                                <tr>
                                    <th class="date-column">Date</th>
                                    <th class="type-column">Type</th>
                                    <th class="description-column">Description</th>
                                    <th class="amount-column text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="transaction in props.transactions"
                                    :key="transaction.transactionId"
                                    class="transaction-row"
                                >
                                    <td>{{ formatDate(transaction.dateInscription) }}</td>
                                    <td>{{ transaction.type }}</td>
                                    <td>{{ transaction.description }}</td>
                                    <td class="text-right">{{ transaction.amount }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    .transaction-list-wrapper {
        height: 100%;
        width: 100%;
    }

    .transaction-card {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .transaction-table-container {
        flex: 1;
        overflow-y: auto;
        max-height: calc(100vh - 260px);
    }

    .transaction-table {
        height: 100%;
    }

    /* Column sizing */
    :deep(.date-column) {
        width: 15%;
    }

    :deep(.type-column) {
        width: 15%;
    }

    :deep(.description-column) {
        width: 50%;
    }

    :deep(.amount-column) {
        width: 20%;
    }

    :deep(.text-right) {
        text-align: right;
    }

    :deep(.transaction-row:nth-child(even)) {
        background-color: rgba(var(--v-theme-surface-variant), 0.3);
    }

    :deep(.transaction-row:nth-child(odd)) {
        background-color: rgba(var(--v-theme-surface), 1);
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
