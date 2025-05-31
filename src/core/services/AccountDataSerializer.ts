import { injectable } from 'inversify'
import type { BankAccountsDictionary, TransactionIdsTable } from '@models/BankAccountTypes'
import type { CSVSettingsList } from '@models/csvDocument'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'
import { useCsvSettingsStore } from '@/stores/csvSettings-store'
import { JsonReplacer, JsonReviver } from '@/core/utils/json-utils'

/**
 * Interface for the AccountDataSerializer service
 */
export interface IAccountDataSerializer {
    /**
     * Exports BankAccounts store data to JSON string
     * @returns JSON string representation of the current BankAccounts store state
     */
    exportBankAccountsData(): string

    /**
     * Imports BankAccounts data from JSON string into the store
     * @param jsonString The JSON string to import
     */
    importBankAccountsData(jsonString: string): void

    /**
     * Exports CSV settings store data to JSON string
     * @returns JSON string representation of the current CSV settings store state
     */
    exportCsvSettingsData(): string

    /**
     * Imports CSV settings data from JSON string into the store
     * @param jsonString The JSON string to import
     */
    importCsvSettingsData(jsonString: string): void

    /**
     * Exports all data (BankAccounts and CSV settings) to JSON string
     * @returns JSON string representation of all store data
     */
    exportAllData(): string

    /**
     * Imports all data (BankAccounts and CSV settings) from JSON string
     * @param jsonString The JSON string to import
     */
    importAllData(jsonString: string): void
}

/**
 * Service responsible for serializing and deserializing data from BankAccounts and csvSettings stores.
 * Works directly with the stores to export and import data using JSON format.
 */
@injectable()
export class AccountDataSerializer implements IAccountDataSerializer {
    /**
     * Exports BankAccounts store data to JSON string
     * @returns JSON string representation of the current BankAccounts store state
     */
    exportBankAccountsData(): string {
        const bankAccountsStore = useBankAccountsStore()
        const data = {
            accounts: bankAccountsStore.accounts,
            transactionsIdsIndex: bankAccountsStore.transactionsIdsIndex
        }
        return JSON.stringify(data, JsonReplacer)
    }

    /**
     * Imports BankAccounts data from JSON string into the store
     * @param jsonString The JSON string to import
     */
    importBankAccountsData(jsonString: string): void {
        const bankAccountsStore = useBankAccountsStore()
        const parsedData = JSON.parse(jsonString, JsonReviver) as {
            accounts: BankAccountsDictionary
            transactionsIdsIndex?: { [accountId: string]: TransactionIdsTable }
        }

        // Clear existing data
        bankAccountsStore.clear()

        // Import the accounts
        Object.values(parsedData.accounts).forEach((account) => {
            bankAccountsStore.addWithBankAccount(account)
        })

        // Import transaction IDs index if provided
        if (parsedData.transactionsIdsIndex) {
            // Since transactionsIdsIndex is populated automatically when adding accounts,
            // we don't need to manually set it
        }
    }

    /**
     * Exports CSV settings store data to JSON string
     * @returns JSON string representation of the current CSV settings store state
     */
    exportCsvSettingsData(): string {
        const csvSettingsStore = useCsvSettingsStore()
        return JSON.stringify(csvSettingsStore.settings, JsonReplacer)
    }

    /**
     * Imports CSV settings data from JSON string into the store
     * @param jsonString The JSON string to import
     */
    importCsvSettingsData(jsonString: string): void {
        const csvSettingsStore = useCsvSettingsStore()
        const settings = JSON.parse(jsonString, JsonReviver) as CSVSettingsList

        // Replace existing settings with imported ones
        // First, remove existing settings (clear the array)
        const existingSettings = [...csvSettingsStore.settings]
        existingSettings.forEach((setting) => {
            csvSettingsStore.removeSetting(setting.id)
        })

        // Then add all imported settings
        settings.forEach((setting) => {
            csvSettingsStore.addSetting(setting)
        })
    }

    /**
     * Exports all data (BankAccounts and CSV settings) to JSON string
     * @returns JSON string representation of all store data
     */
    exportAllData(): string {
        const bankAccountsStore = useBankAccountsStore()
        const csvSettingsStore = useCsvSettingsStore()

        const data = {
            accounts: bankAccountsStore.accounts,
            transactionsIdsIndex: bankAccountsStore.transactionsIdsIndex,
            csvSettings: csvSettingsStore.settings
        }

        return JSON.stringify(data, JsonReplacer)
    }

    /**
     * Imports all data (BankAccounts and CSV settings) from JSON string
     * @param jsonString The JSON string to import
     */
    importAllData(jsonString: string): void {
        const parsedData = JSON.parse(jsonString, JsonReviver) as {
            accounts: BankAccountsDictionary
            transactionsIdsIndex?: { [accountId: string]: TransactionIdsTable }
            csvSettings?: CSVSettingsList
        }

        // Import bank accounts
        if (parsedData.accounts) {
            this.importBankAccountsData(
                JSON.stringify(
                    {
                        accounts: parsedData.accounts,
                        transactionsIdsIndex: parsedData.transactionsIdsIndex
                    },
                    JsonReplacer
                )
            )
        }

        // Import CSV settings if available
        if (parsedData.csvSettings) {
            this.importCsvSettingsData(JSON.stringify(parsedData.csvSettings, JsonReplacer))
        }
    }
}
