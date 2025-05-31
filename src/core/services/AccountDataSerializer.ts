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
     * Saves BankAccounts store data to JSON string
     * @returns JSON string representation of the current BankAccounts store state
     */
    saveBankAccountsData(): string

    /**
     * Loads BankAccounts data from JSON string into the store
     * @param jsonString The JSON string to load
     */
    loadBankAccountsData(jsonString: string): void

    /**
     * Saves CSV settings store data to JSON string
     * @returns JSON string representation of the current CSV settings store state
     */
    saveCsvSettingsData(): string

    /**
     * Loads CSV settings data from JSON string into the store
     * @param jsonString The JSON string to load
     */
    loadCsvSettingsData(jsonString: string): void

    /**
     * Saves all data (BankAccounts and CSV settings) to JSON string
     * @returns JSON string representation of all store data
     */
    saveAllData(): string

    /**
     * Loads all data (BankAccounts and CSV settings) from JSON string
     * @param jsonString The JSON string to load
     */
    loadAllData(jsonString: string): void
}

/**
 * Service responsible for serializing and deserializing data from BankAccounts and csvSettings stores.
 * Works directly with the stores to save and load data using JSON format.
 */
@injectable()
export class AccountDataSerializer implements IAccountDataSerializer {
    /**
     * Saves BankAccounts store data to JSON string
     * @returns JSON string representation of the current BankAccounts store state
     */
    saveBankAccountsData(): string {
        const bankAccountsStore = useBankAccountsStore()
        const data = {
            accounts: bankAccountsStore.accounts,
            transactionsIdsIndex: bankAccountsStore.transactionsIdsIndex
        }
        return JSON.stringify(data, JsonReplacer)
    }

    /**
     * Loads BankAccounts data from JSON string into the store
     * @param jsonString The JSON string to load
     */
    loadBankAccountsData(jsonString: string): void {
        const bankAccountsStore = useBankAccountsStore()
        const parsedData = JSON.parse(jsonString, JsonReviver) as {
            accounts: BankAccountsDictionary
            transactionsIdsIndex?: { [accountId: string]: TransactionIdsTable }
        }

        // Clear existing data
        bankAccountsStore.clear()

        // Load the accounts
        Object.values(parsedData.accounts).forEach((account) => {
            bankAccountsStore.addWithBankAccount(account)
        })

        // Load transaction IDs index if provided
        if (parsedData.transactionsIdsIndex) {
            // Since transactionsIdsIndex is populated automatically when adding accounts,
            // we don't need to manually set it
        }
    }

    /**
     * Saves CSV settings store data to JSON string
     * @returns JSON string representation of the current CSV settings store state
     */
    saveCsvSettingsData(): string {
        const csvSettingsStore = useCsvSettingsStore()
        return JSON.stringify(csvSettingsStore.settings, JsonReplacer)
    }

    /**
     * Loads CSV settings data from JSON string into the store
     * @param jsonString The JSON string to load
     */
    loadCsvSettingsData(jsonString: string): void {
        const csvSettingsStore = useCsvSettingsStore()
        const settings = JSON.parse(jsonString, JsonReviver) as CSVSettingsList

        // Replace existing settings with loaded ones
        // First, remove existing settings (clear the array)
        const existingSettings = [...csvSettingsStore.settings]
        existingSettings.forEach((setting) => {
            csvSettingsStore.removeSetting(setting.id)
        })

        // Then add all loaded settings
        settings.forEach((setting) => {
            csvSettingsStore.addSetting(setting)
        })
    }

    /**
     * Saves all data (BankAccounts and CSV settings) to JSON string
     * @returns JSON string representation of all store data
     */
    saveAllData(): string {
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
     * Loads all data (BankAccounts and CSV settings) from JSON string
     * @param jsonString The JSON string to load
     */
    loadAllData(jsonString: string): void {
        const parsedData = JSON.parse(jsonString, JsonReviver) as {
            accounts: BankAccountsDictionary
            transactionsIdsIndex?: { [accountId: string]: TransactionIdsTable }
            csvSettings?: CSVSettingsList
        }

        // Load bank accounts
        if (parsedData.accounts) {
            this.loadBankAccountsData(
                JSON.stringify(
                    {
                        accounts: parsedData.accounts,
                        transactionsIdsIndex: parsedData.transactionsIdsIndex
                    },
                    JsonReplacer
                )
            )
        }

        // Load CSV settings if available
        if (parsedData.csvSettings) {
            this.loadCsvSettingsData(JSON.stringify(parsedData.csvSettings, JsonReplacer))
        }
    }
}
