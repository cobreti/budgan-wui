<template>
    <v-expansion-panel>
        <v-expansion-panel-title>
            {{ statement?.filename || 'Unknown Statement' }} - {{ statement?.account.accountId }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
            <div class="" v-if="statement">
                <div class="d-flex flex-row flex-wrap align-content-space-evenly">
                    <v-card class="trans-group">
                        <div class="line-content">
                            <span class="title">Filename :</span>
                            <span class="content">{{ statement.filename }}</span>
                        </div>
                        <div class="line-content">
                            <span class="title">Date :</span>
                            <span class="content"
                                >{{ statement.startDate.toDateString() }} -
                                {{ statement.endDate.toDateString() }}</span
                            >
                        </div>
                        <div class="line-content">
                            <span class="title">transactions count :</span>
                            <span class="content">{{ statement.numberOfTransactions }}</span>
                        </div>
                        <div class="line-content">
                            <span class="title">Duplicate transactions :</span>
                            <span
                                class="content"
                                :class="{
                                    'text-warning': statement.duplicateTransactions.length > 0
                                }"
                            >
                                {{ statement.duplicateTransactions.length }}
                                <v-btn
                                    v-if="statement.duplicateTransactions.length > 0"
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
                            <div
                                v-if="showDuplicates && statement.duplicateTransactions.length > 0"
                                class="mt-3 mb-3"
                            >
                                <v-card variant="outlined" class="pa-2">
                                    <div class="text-subtitle-2 mb-2">Duplicate Transactions</div>
                                    <v-list density="compact" class="duplicate-list">
                                        <v-list-item
                                            v-for="(
                                                transaction, index
                                            ) in statement.duplicateTransactions"
                                            :key="index"
                                        >
                                            <div class="d-flex flex-column">
                                                <div class="duplicate-item-row">
                                                    <strong>Date:</strong>
                                                    {{
                                                        transaction.dateInscription.toLocaleDateString()
                                                    }}
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

                        <div class="line-content">
                            <span class="title">Account ID :</span>
                            <span class="content">{{ statement.account.accountId }}</span>
                        </div>
                        <div class="line-content">
                            <span class="title">Account Name :</span>
                            <span class="content">{{ statement.account.name }}</span>
                        </div>
                        <div class="line-content">
                            <span class="title">Account Type :</span>
                            <span class="content">{{ statement.account.accountType }}</span>
                        </div>
                    </v-card>
                </div>
            </div>
        </v-expansion-panel-text>
    </v-expansion-panel>
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

    .trans-group {
        display: block;
        position: relative;
        overflow: auto;
        width: 45%;
        margin: 1em;
        padding: 1em;
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
    import { computed, ref } from 'vue'
    import { useAddStatementStore } from '@/stores/add-statement-store'

    const props = defineProps<{
        statementId: string
    }>()

    const addStatementStore = useAddStatementStore()

    const statement = computed(() => {
        return addStatementStore.getStatementById(props.statementId)
    })

    const showDuplicates = ref(false)
</script>
