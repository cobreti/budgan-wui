<template>
    <div>
        <account-header :bank-account="targetAccount">
            <v-btn flat :to="{ path: 'transactions', replace: true }">
                <!--        <v-icon-->
                <!--          size="24"-->
                <!--          icon="mdi-file-upload-outline"></v-icon>-->
                transactions
            </v-btn>
        </account-header>
        <div class="page-container pa-2">
            <div class="d-flex flex-column align-content-start h-100">
                <v-card
                    class="file-input-card pt-4 pr-4 pl-4 pb-4 mr-2 mb-2"
                    :class="{ 'd-none': statementPresent }"
                >
                    <div class="d-flex flex-row mb-2">
                        <div class="d-flex flex-column justify-center mr-4 mb-4">
                            <label for="statement-file-input"> Bank statement file </label>
                        </div>
                        <v-file-input
                            id="statement-file-input"
                            class="mr-4"
                            v-model="ofxFileName"
                            :disabled="addStatementStore.loading"
                            @update:modelValue="onFileNameUpdated"
                            accept=".csv"
                            :multiple="true"
                        ></v-file-input>
                    </div>
                </v-card>
                <v-card class="action-card" v-show="statementPresent">
                    <div class="d-flex flex-column align-content-center ma-5">
                        <v-expansion-panels class="elevation-0">
                            <bdg-account-added
                                v-for="id in statementIds"
                                :key="id"
                                :statementId="id"
                            ></bdg-account-added>
                        </v-expansion-panels>
                    </div>
                    <v-card-actions class="d-flex flex-grow-1 flex-row justify-center">
                        <v-btn @click="onAdd">Add</v-btn>
                        <v-btn @click="onDiscard()">Discard</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .page-container {
        height: 100%;
    }

    .file-input-card {
        flex: 1 1 0;
        display: block;
        position: relative;
        min-height: 10em;
    }
</style>

<script setup lang="ts">
    import AccountHeader from '@/components/account/BdgAccountHeader.vue'
    import BdgAccountAdded from '@/components/account/BdgAccountAdded.vue'
    import { computed, defineModel } from 'vue'
    import { useAddStatementStore } from '@/stores/add-statement-store'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import { container } from '@/core/setupInversify'
    import type { IBankAccountLoader } from '@services/BankAccountLoader'
    import { ServicesTypes } from '@services/types'
    import { useRoute } from 'vue-router'
    import { useCsvSettingsStore } from '@/stores/csvSettings-store'

    const ofxFileName = defineModel<File[]>()
    const addStatementStore = useAddStatementStore()
    const bankAccountStore = useBankAccountsStore()
    const csvSettingsStore = useCsvSettingsStore()
    const route = useRoute()

    const targetAccountId = computed(() => {
        return route.params.id as string
    })

    const statementIds = computed(() => {
        return Object.keys(addStatementStore.statements)
    })

    const targetAccount = computed(() => {
        return bankAccountStore.getAccountById(targetAccountId.value)
    })

    const statementPresent = computed(() => {
        return statementIds.value.length > 0
    })

    async function onFileNameUpdated(files: File[] | File) {
        if (!targetAccount.value.csvSettingId) {
            console.error('No CSV setting ID found for the target account')
            return
        }

        const csvSettings = csvSettingsStore.getSettings(targetAccount.value.csvSettingId)

        if (!csvSettings) {
            console.error('No CSV settings found for the target account')
            return
        }

        const filesArray = Array.isArray(files) ? files : [files]

        if (filesArray.length == 0) {
            return
        }

        // Create a fresh bank account loader for the files
        const bankAccountLoader = container.get<IBankAccountLoader>(ServicesTypes.BankAccountLoader)

        if (!bankAccountLoader) {
            throw new Error('No BankAccountLoader service found')
        }

        bankAccountLoader.loadingFileStarted = (fileName: string) => {
            addStatementStore.setLoadingFile(fileName)
        }

        // Load all files and get statements directly
        const statements = await bankAccountLoader.loadWithAccount(
            targetAccount.value,
            csvSettings.columnsMapping,
            filesArray
        )

        // Sanitize after loading all files
        bankAccountLoader.sanitize(bankAccountStore.accounts)

        // Add all statements to the store
        statements.forEach((statement) => {
            addStatementStore.setStatement(statement)
        })

        addStatementStore.clearLoadingFileStatus()
    }

    function clear() {
        ofxFileName.value = []
        addStatementStore.clear()
    }

    function onDiscard() {
        clear()
    }

    function onAdd() {
        const statements = addStatementStore.statements

        Object.values(statements).forEach((statement) => {
            bankAccountStore.addWithBankAccount(statement.account, targetAccountId.value)
        })

        clear()
    }
</script>
