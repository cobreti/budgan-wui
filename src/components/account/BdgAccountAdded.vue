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
                        <BdgAccountDuplicatedTransactions
                            :duplicate-transactions="statement.duplicateTransactions"
                        />

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
    import { computed } from 'vue'
    import { useAddStatementStore } from '@/stores/add-statement-store'
    import BdgAccountDuplicatedTransactions from '@/components/account/BdgAccountDuplicatedTransactions.vue'

    const props = defineProps<{
        statementId: string
    }>()

    const addStatementStore = useAddStatementStore()

    const statement = computed(() => {
        return addStatementStore.getStatementById(props.statementId)
    })
</script>
