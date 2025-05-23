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
</style>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useAddStatementStore } from '@/stores/add-statement-store'

    const props = defineProps<{
        statementId: string
    }>()

    const addStatementStore = useAddStatementStore()

    const statement = computed(() => {
        return addStatementStore.getStatementById(props.statementId)
    })
</script>
