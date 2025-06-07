<template>
    <main>
        <v-container class="account-container d-flex flex-column align-content-start h-100">
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
                        <v-card-title>Import Statement</v-card-title>

                        <v-tabs v-model="activeTab">
                            <v-tab value="upload">Upload File</v-tab>
                            <v-tab value="mocked">Use Demo Data</v-tab>
                        </v-tabs>

                        <v-card-text class="content-container">
                            <v-window v-model="activeTab" class="window-height w-100">
                                <!-- Upload File Tab -->
                                <v-window-item value="upload" class="w-100">
                                    <div class="d-flex flex-column mb-2 mt-4 full-width-container">
                                        <div class="mb-2">
                                            <label for="statement-file-input">
                                                Bank statement file
                                            </label>
                                        </div>
                                        <v-file-input
                                            id="statement-file-input"
                                            class="full-width-input"
                                            v-model="ofxFileName"
                                            :disabled="addStatementStore.loading"
                                            @update:modelValue="onFileNameUpdated"
                                            accept=".csv"
                                            :multiple="true"
                                        ></v-file-input>
                                    </div>
                                </v-window-item>

                                <!-- Mocked Data Tab -->
                                <v-window-item value="mocked" class="w-100">
                                    <div class="mt-4 full-width-container">
                                        <bdg-mocked-selection
                                            class="full-width-component"
                                            :preselectedCategory="
                                                targetAccount.accountType
                                                    ?.toLowerCase()
                                                    .includes('credit')
                                                    ? 'creditcard'
                                                    : 'bank-account'
                                            "
                                            @select="onMockedFileSelected"
                                        ></bdg-mocked-selection>
                                    </div>
                                </v-window-item>
                            </v-window>
                        </v-card-text>
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
        </v-container>
    </main>
</template>

<style scoped>
    .account-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .page-container {
        height: 100%;
    }

    .file-input-card {
        flex: 1 1 0;
        display: block;
        position: relative;
        min-height: 35em; /* Increased from 10em to 25em to accommodate both input methods */
    }

    .max-width-50 {
        max-width: 50%;
    }

    .content-container {
        min-height: 30em;
    }

    .window-height {
        min-height: 18em;
        /* display: flex; */
        width: 100%;
    }

    /* Ensure full width for input containers */
    .full-width-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .full-width-input {
        width: 100%;
    }

    .full-width-component {
        width: 100%;
    }
</style>

<script setup lang="ts">
    import AccountHeader from '@/components/account/BdgAccountHeader.vue'
    import BdgAccountAdded from '@/components/account/BdgAccountAdded.vue'
    import BdgMockedSelection from '@/components/BdgMockedSelection.vue'
    import { computed, defineModel, ref } from 'vue'
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

    // Tab selection for file input methods
    const activeTab = ref('upload')

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

    async function onMockedFileSelected(_filePath: string, fileContent: File) {
        // Use the file content as if it was uploaded via file input
        onFileNameUpdated(fileContent)
    }

    function onAdd() {
        const statements = addStatementStore.statements

        Object.values(statements).forEach((statement) => {
            bankAccountStore.addWithBankAccount(statement.account, targetAccountId.value)
        })

        clear()
    }
</script>
