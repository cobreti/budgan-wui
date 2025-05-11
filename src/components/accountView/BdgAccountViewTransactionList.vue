<template>
    <div class="container">
        <v-table :headers="headers" :items="props.transactions">
            <tbody>
                <tr
                    v-for="(transaction, index) in props.transactions"
                    :key="transaction.transactionId"
                    class="transaction"
                >
                    <td>{{ formatDate(transaction.dateInscription) }}</td>
                    <td>{{ transaction.type }}</td>
                    <td>{{ transaction.description }}</td>
                    <td>{{ transaction.amount }}</td>
                </tr>
            </tbody>
        </v-table>
    </div>
</template>

<style scoped>
    .container {
        display: block;
        position: relative;
        overflow: auto;
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

    const headers = [
        {
            title: 'Date',
            key: 'dateInscription'
        },
        {
            title: 'Type',
            key: 'type'
        },
        {
            title: 'Description',
            key: 'description'
        },
        {
            title: 'Amount',
            key: 'amount'
        }
    ]

    console.log('transactions', props.transactions.values)
</script>
