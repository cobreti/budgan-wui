<template>
    <div>
        <div class="line-content">
            <span class="title">Duplicate transactions :</span>
            <span
                class="content"
                :class="{
                    'text-warning': duplicateTransactions.length > 0
                }"
            >
                {{ duplicateTransactions.length }}
                <v-btn
                    v-if="duplicateTransactions.length > 0"
                    x-small
                    text
                    color="primary"
                    class="ml-2"
                    @click="showDuplicates = !showDuplicates"
                >
                    {{ showDuplicates ? 'Hide' : 'Show' }}
                </v-btn>
            </span>
        </div>

        <v-expand-transition>
            <div v-if="showDuplicates && duplicateTransactions.length > 0" class="mt-3 mb-3">
                <v-card variant="outlined" class="pa-2">
                    <div class="text-subtitle-2 mb-2">Duplicate Transactions</div>
                    <v-list density="compact" class="duplicate-list">
                        <v-list-item
                            v-for="(transaction, index) in duplicateTransactions"
                            :key="index"
                        >
                            <div class="d-flex flex-column">
                                <div class="duplicate-item-row">
                                    <strong>Date:</strong>
                                    {{ transaction.dateInscription.toLocaleDateString() }}
                                </div>
                                <div class="duplicate-item-row">
                                    <strong>Amount:</strong>
                                    {{ transaction.amount }}
                                </div>
                                <div class="duplicate-item-row">
                                    <strong>Description:</strong>
                                    {{ transaction.description }}
                                </div>
                            </div>
                        </v-list-item>
                    </v-list>
                </v-card>
            </div>
        </v-expand-transition>
    </div>
</template>

<style scoped>
    .line-content {
        display: flex;
        flex-direction: row;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        font-size: 90%;
        cursor: default;
    }

    .title {
        font-weight: bold;
        margin-right: 1em;
        min-width: 12em;
    }

    .content {
        font-weight: normal;
    }

    .text-warning {
        color: #ff9800;
        font-weight: bold;
    }

    .duplicate-list {
        max-height: 300px;
        overflow-y: auto;
        background-color: #f5f5f5;
    }

    .duplicate-item-row {
        margin: 2px 0;
    }
</style>

<script setup lang="ts">
    import { ref } from 'vue'

    defineProps<{
        duplicateTransactions: Array<any>
    }>()

    const showDuplicates = ref(false)
</script>
