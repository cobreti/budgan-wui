import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AccountDataSerializer } from './AccountDataSerializer'
import type { BankAccount } from '@models/BankAccountTypes'
import { CSVColumnContent } from '@models/csvDocument'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'
import { useCsvSettingsStore } from '@/stores/csvSettings-store'

// Create mock stores
vi.mock('@/stores/bankAccounts-store', () => {
    const mockStore = {
        accounts: {},
        transactionsIdsIndex: {},
        clear: vi.fn(),
        addWithBankAccount: vi.fn()
    }
    return {
        useBankAccountsStore: vi.fn(() => mockStore)
    }
})

vi.mock('@/stores/csvSettings-store', () => {
    const mockStore = {
        settings: [],
        addSetting: vi.fn(),
        removeSetting: vi.fn()
    }
    return {
        useCsvSettingsStore: vi.fn(() => mockStore)
    }
})

describe('AccountDataSerializer', () => {
    let serializer: AccountDataSerializer
    let bankAccountsStore: ReturnType<typeof useBankAccountsStore>
    let csvSettingsStore: ReturnType<typeof useCsvSettingsStore>

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks()

        // Get store references
        bankAccountsStore = useBankAccountsStore()
        csvSettingsStore = useCsvSettingsStore()

        // Create serializer
        serializer = new AccountDataSerializer()
    })

    describe('BankAccounts serialization', () => {
        it('should export BankAccounts store data to JSON', () => {
            // Setup mocked store data
            const testAccount: BankAccount = {
                name: 'Test Account',
                accountId: 'test-account-1',
                accountType: 'Checking',
                transactionsGroups: [
                    {
                        name: 'Test Group',
                        id: 'group-1',
                        dateStart: new Date('2025-01-01'),
                        dateEnd: new Date('2025-01-31')
                    }
                ],
                transactions: [
                    {
                        transactionId: 'trans-1',
                        transactionGroupId: 'group-1',
                        dateInscription: new Date('2025-01-15'),
                        amount: 100.5,
                        type: 'deposit',
                        description: 'Test transaction'
                    }
                ]
            }

            // Set up store mock data
            bankAccountsStore.accounts = { 'test-account-1': testAccount }
            bankAccountsStore.transactionsIdsIndex = { 'test-account-1': { 'trans-1': {} } }

            // Export data
            const exported = serializer.exportBankAccountsData()

            // Should be a JSON string
            expect(typeof exported).toBe('string')

            // Verify JSON contains expected data
            const parsed = JSON.parse(exported)
            expect(parsed).toHaveProperty('accounts')
            expect(parsed).toHaveProperty('transactionsIdsIndex')
            expect(parsed.accounts).toHaveProperty('test-account-1')
        })

        it('should import BankAccounts data into store', () => {
            // Create test data
            const jsonData = JSON.stringify({
                accounts: {
                    'test-account-1': {
                        name: 'Test Account',
                        accountId: 'test-account-1',
                        accountType: 'Checking',
                        transactionsGroups: [
                            {
                                name: 'Test Group',
                                id: 'group-1',
                                dateStart: {
                                    type: '7f5e8a12-09b3-4dfc-a726-89ed4731cb56',
                                    value: '2025-01-01T00:00:00.000Z'
                                },
                                dateEnd: {
                                    type: '7f5e8a12-09b3-4dfc-a726-89ed4731cb56',
                                    value: '2025-01-31T00:00:00.000Z'
                                }
                            }
                        ],
                        transactions: [
                            {
                                transactionId: 'trans-1',
                                transactionGroupId: 'group-1',
                                dateInscription: {
                                    type: '7f5e8a12-09b3-4dfc-a726-89ed4731cb56',
                                    value: '2025-01-15T00:00:00.000Z'
                                },
                                amount: 100.5,
                                type: 'deposit',
                                description: 'Test transaction'
                            }
                        ]
                    }
                },
                transactionsIdsIndex: {
                    'test-account-1': {
                        'trans-1': {}
                    }
                }
            })

            // Import the data
            serializer.importBankAccountsData(jsonData)

            // Verify store methods were called correctly
            expect(bankAccountsStore.clear).toHaveBeenCalled()
            expect(bankAccountsStore.addWithBankAccount).toHaveBeenCalledTimes(1)
        })
    })

    describe('CSVSettings serialization', () => {
        it('should export CSVSettings store data to JSON', () => {
            // Setup mock data
            csvSettingsStore.settings = [
                {
                    id: 'settings-1',
                    name: 'Bank CSV Format',
                    delimiter: ',',
                    columnsMapping: {
                        [CSVColumnContent.CARD_NUMBER]: 0,
                        [CSVColumnContent.DATE_INSCRIPTION]: 1,
                        [CSVColumnContent.DATE_TRANSACTION]: 2,
                        [CSVColumnContent.AMOUNT]: 3,
                        [CSVColumnContent.DESCRIPTION]: 4,
                        [CSVColumnContent.TYPE]: 5
                    }
                }
            ]

            // Export data
            const exported = serializer.exportCsvSettingsData()

            // Should be a JSON string
            expect(typeof exported).toBe('string')

            // Verify JSON contains expected data
            const parsed = JSON.parse(exported)
            expect(Array.isArray(parsed)).toBe(true)
            expect(parsed.length).toBe(1)
            expect(parsed[0].id).toBe('settings-1')
        })

        it('should import CSVSettings data into store', () => {
            // Create test data with a single setting
            const jsonData = JSON.stringify([
                {
                    id: 'settings-1',
                    name: 'Bank CSV Format',
                    delimiter: ',',
                    columnsMapping: {
                        [CSVColumnContent.CARD_NUMBER]: 0,
                        [CSVColumnContent.DATE_INSCRIPTION]: 1,
                        [CSVColumnContent.DATE_TRANSACTION]: 2,
                        [CSVColumnContent.AMOUNT]: 3,
                        [CSVColumnContent.DESCRIPTION]: 4,
                        [CSVColumnContent.TYPE]: 5
                    }
                }
            ])

            // Setup existing settings to be removed
            csvSettingsStore.settings = [
                {
                    id: 'old-setting',
                    name: 'Old Setting',
                    delimiter: ',',
                    columnsMapping: {
                        [CSVColumnContent.CARD_NUMBER]: null,
                        [CSVColumnContent.DATE_INSCRIPTION]: null,
                        [CSVColumnContent.DATE_TRANSACTION]: null,
                        [CSVColumnContent.AMOUNT]: null,
                        [CSVColumnContent.DESCRIPTION]: null,
                        [CSVColumnContent.TYPE]: null
                    }
                }
            ]

            // Import data
            serializer.importCsvSettingsData(jsonData)

            // Verify old settings were removed and new ones added
            expect(csvSettingsStore.removeSetting).toHaveBeenCalledWith('old-setting')
            expect(csvSettingsStore.addSetting).toHaveBeenCalledTimes(1)
        })
    })

    describe('Combined data serialization', () => {
        it('should export all data (BankAccounts and CSV settings) to JSON', () => {
            // Setup mocked store data
            const testAccount: BankAccount = {
                name: 'Test Account',
                accountId: 'test-account-1',
                accountType: 'Checking',
                transactionsGroups: [
                    {
                        name: 'Test Group',
                        id: 'group-1',
                        dateStart: new Date('2025-01-01'),
                        dateEnd: new Date('2025-01-31')
                    }
                ],
                transactions: [
                    {
                        transactionId: 'trans-1',
                        transactionGroupId: 'group-1',
                        dateInscription: new Date('2025-01-15'),
                        amount: 100.5,
                        type: 'deposit',
                        description: 'Test transaction'
                    }
                ]
            }

            // Setup bank accounts store
            bankAccountsStore.accounts = { 'test-account-1': testAccount }
            bankAccountsStore.transactionsIdsIndex = { 'test-account-1': { 'trans-1': {} } }

            // Setup CSV settings store
            csvSettingsStore.settings = [
                {
                    id: 'settings-1',
                    name: 'Bank CSV Format',
                    delimiter: ',',
                    columnsMapping: {
                        [CSVColumnContent.CARD_NUMBER]: 0,
                        [CSVColumnContent.DATE_INSCRIPTION]: 1,
                        [CSVColumnContent.DATE_TRANSACTION]: 2,
                        [CSVColumnContent.AMOUNT]: 3,
                        [CSVColumnContent.DESCRIPTION]: 4,
                        [CSVColumnContent.TYPE]: 5
                    }
                }
            ]

            // Export all data
            const exported = serializer.exportAllData()

            // Should be a JSON string
            expect(typeof exported).toBe('string')

            // Verify JSON contains expected data
            const parsed = JSON.parse(exported)
            expect(parsed).toHaveProperty('accounts')
            expect(parsed).toHaveProperty('transactionsIdsIndex')
            expect(parsed).toHaveProperty('csvSettings')
            expect(parsed.accounts).toHaveProperty('test-account-1')
            expect(Array.isArray(parsed.csvSettings)).toBe(true)
            expect(parsed.csvSettings.length).toBe(1)
            expect(parsed.csvSettings[0].id).toBe('settings-1')
        })

        it('should import all data (BankAccounts and CSV settings)', () => {
            // Create test data
            const jsonData = JSON.stringify({
                accounts: {
                    'test-account-1': {
                        name: 'Test Account',
                        accountId: 'test-account-1',
                        accountType: 'Checking',
                        transactionsGroups: [
                            {
                                name: 'Test Group',
                                id: 'group-1',
                                dateStart: {
                                    type: '7f5e8a12-09b3-4dfc-a726-89ed4731cb56',
                                    value: '2025-01-01T00:00:00.000Z'
                                },
                                dateEnd: {
                                    type: '7f5e8a12-09b3-4dfc-a726-89ed4731cb56',
                                    value: '2025-01-31T00:00:00.000Z'
                                }
                            }
                        ],
                        transactions: [
                            {
                                transactionId: 'trans-1',
                                transactionGroupId: 'group-1',
                                dateInscription: {
                                    type: '7f5e8a12-09b3-4dfc-a726-89ed4731cb56',
                                    value: '2025-01-15T00:00:00.000Z'
                                },
                                amount: 100.5,
                                type: 'deposit',
                                description: 'Test transaction'
                            }
                        ]
                    }
                },
                transactionsIdsIndex: {
                    'test-account-1': {
                        'trans-1': {}
                    }
                },
                csvSettings: [
                    {
                        id: 'settings-1',
                        name: 'Bank CSV Format',
                        delimiter: ',',
                        columnsMapping: {
                            [CSVColumnContent.CARD_NUMBER]: 0,
                            [CSVColumnContent.DATE_INSCRIPTION]: 1,
                            [CSVColumnContent.DATE_TRANSACTION]: 2,
                            [CSVColumnContent.AMOUNT]: 3,
                            [CSVColumnContent.DESCRIPTION]: 4,
                            [CSVColumnContent.TYPE]: 5
                        }
                    }
                ]
            })

            // Setup existing settings to be removed
            csvSettingsStore.settings = [
                {
                    id: 'old-setting',
                    name: 'Old Setting',
                    delimiter: ',',
                    columnsMapping: {
                        [CSVColumnContent.CARD_NUMBER]: null,
                        [CSVColumnContent.DATE_INSCRIPTION]: null,
                        [CSVColumnContent.DATE_TRANSACTION]: null,
                        [CSVColumnContent.AMOUNT]: null,
                        [CSVColumnContent.DESCRIPTION]: null,
                        [CSVColumnContent.TYPE]: null
                    }
                }
            ]

            // Spy on the methods that importAllData will call
            const exportBankAccountsDataSpy = vi.spyOn(serializer, 'importBankAccountsData')
            const exportCsvSettingsDataSpy = vi.spyOn(serializer, 'importCsvSettingsData')

            // Import all data
            serializer.importAllData(jsonData)

            // Verify both import methods were called
            expect(exportBankAccountsDataSpy).toHaveBeenCalled()
            expect(exportCsvSettingsDataSpy).toHaveBeenCalled()
        })
    })
})
