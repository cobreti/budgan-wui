import type { BankAccount } from '@models/BankAccountTypes'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'
import { useCsvSettingsStore } from './csvSettings-store'
import type { CSVSettingsList } from '@/core/models/csvDocument'

export type BankAccountExportFormat = BankAccount

export type BankAccountsExportDictionary = { [key: string]: BankAccountExportFormat }

export type BankAccountsExportFile = {
    accounts: BankAccountsExportDictionary
    csvSettings: CSVSettingsList
}

export type ExportAccountsStore = {
    exportContent: Ref<BankAccountsExportFile>
    getSaveBankAccountDataForAllAccounts: (accountsIds: Array<string>) => void
    getCsvSettings: () => void
    clear: () => void
}

export const useExportAccountsStore = defineStore<string, ExportAccountsStore>(
    'exportAccounts',
    () => {
        const accountsStore = useBankAccountsStore()
        const csvSettingsStore = useCsvSettingsStore()

        const exportContent = ref<BankAccountsExportFile>({ accounts: {}, csvSettings: [] })

        function getSaveBankAccountData(accountId: string): BankAccountExportFormat {
            const account = accountsStore.accounts[accountId]

            if (!account) {
                throw new Error(`undefined account ${accountId}`)
            }

            return account as BankAccountExportFormat
        }

        function getSaveBankAccountDataForAllAccounts(accountsIds: Array<string>) {
            const bankAccounts = accountsStore.accounts
            const tmpAccount: BankAccountsExportDictionary = {}

            for (const accountId in bankAccounts) {
                if (accountsIds.includes(accountId)) {
                    tmpAccount[accountId] = getSaveBankAccountData(accountId)
                }
            }

            exportContent.value.accounts = tmpAccount
        }

        function getCsvSettings() {
            const csvSettings = csvSettingsStore.settings
            exportContent.value.csvSettings = csvSettings
        }

        function clear() {
            exportContent.value = { accounts: {}, csvSettings: [] }
        }

        return {
            exportContent,
            getSaveBankAccountDataForAllAccounts,
            getCsvSettings,
            clear
        }
    }
)
