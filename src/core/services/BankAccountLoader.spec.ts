import { BankAccountLoader, type BankAccountListById } from '@services/BankAccountLoader'
import { type IOfxToBankAccount } from './OfxToBankAccount'
import {
    type BankAccount,
    type BankAccountTransactionsGroup,
    InvalidTransactionReason
} from '@models/BankAccountTypes'
import { CSVColumnContent, type CSVColumnContentMapping } from '@models/csvDocument'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
    LoadMultipleAccountsTest_Expected,
    LoadMultipleAccountsTest_Input,
    LoadSingleFileTestSuccess_Expected,
    LoadSingleFileTestSuccess_Input,
    LoadSortLoadedAccountByIdTest_Expected,
    LoadSortLoadedAccountByIdTest_Input
} from './tests-files/BankAccountLoader/load-test-data'
import type { IBankAccountOperations } from './BankAccountOperations'
import type { IBankAccountTransactionsSanitizerFactory } from './BankAccountTransactionsSanitizerFactory'
import type { IBankAccountTransactionsSanitizer } from './BankAccountTransactionsSanitizer'
import { combineAndSortTransactionsGroup_success_expected } from '@services/tests-files/BankAccountLoader/combineAndSorteTransactionsGroup-test-data'
import { sanitizeNewAccounts_accountsById_expected_data } from '@services/tests-files/BankAccountLoader/sanitize-test-data'
import { accountsById_test_data } from '@services/tests-files/BankAccountLoader/accountsById-test-data'
import type { ICsvToBankAccount } from '@services/CsvToBankAccount'
import type { IStreamFactory } from '@services/StreamFactory'
import type { ICsvParser } from '@services/CsvParser'

describe('BankAccountLoader', async () => {
    const ofxToBankAccount: IOfxToBankAccount = {
        loadOfxFile: async (file: File): Promise<BankAccount> => {
            return {} as BankAccount
        }
    } as IOfxToBankAccount

    const csvToBankAccount: ICsvToBankAccount = {} as ICsvToBankAccount

    const bankAccountOperations: IBankAccountOperations = {
        getCombinedTransactionsGroup: (...accounts): BankAccountTransactionsGroup[] => {
            return []
        },
        sortTransactionsGroupByStartDateAscending: (
            transactionsGroup: BankAccountTransactionsGroup[]
        ): BankAccountTransactionsGroup[] => {
            return []
        }
    } as IBankAccountOperations

    const bankAccountTransactionsSanitizerFactory: IBankAccountTransactionsSanitizerFactory = {
        create: (account: BankAccount) => {
            return {} as IBankAccountTransactionsSanitizer
        }
    } as IBankAccountTransactionsSanitizerFactory

    const streamFactory = {} as IStreamFactory

    const csvParser = {} as ICsvParser

    let bankAccountLoader: BankAccountLoader = {} as BankAccountLoader

    beforeEach(async () => {
        bankAccountLoader = new BankAccountLoader(
            ofxToBankAccount,
            csvToBankAccount,
            bankAccountOperations,
            bankAccountTransactionsSanitizerFactory,
            streamFactory,
            csvParser
        )
    })

    afterEach(async () => {
        vi.resetAllMocks()
    })

    describe('load', async () => {
        test('single file success path', async () => {
            const files: File[] = [new File([''], 'test.ofx')]
            const loadedAccountsExpectedValue = {
                '123456789': [LoadSingleFileTestSuccess_Expected]
            }

            const loadOfxFileSpy = vi
                .spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValue(LoadSingleFileTestSuccess_Input)

            await bankAccountLoader.load(files)

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1)
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue)
        })

        test('single file with failure', async () => {
            const files: File[] = [new File([''], 'test.ofx')]
            const loadedAccountsExpectedValue: BankAccountListById = {}

            const loadOfxFileSpy = vi
                .spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error')

            await bankAccountLoader.load(files)

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1)
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue)
        })

        test('single file with failure and error callback', async () => {
            const files: File[] = [new File([''], 'test.ofx')]
            const loadedAccountsExpectedValue: BankAccountListById = {}

            const loadOfxFileSpy = vi
                .spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error')

            const accountLoadError = (filename: string, error: unknown) => {}
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError)

            bankAccountLoader.accountLoadError = accountLoadErrorMock
            await bankAccountLoader.load(files)

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1)
            expect(accountLoadErrorMock).toHaveBeenCalledTimes(1)
            expect(accountLoadErrorMock).toHaveBeenCalledWith('test.ofx', 'Error')
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue)
        })

        test('multiple files with success and failure', async () => {
            const files: File[] = [
                new File([''], 'test.ofx'),
                new File([''], 'test2.ofx'),
                new File([''], 'test3.ofx')
            ]

            const loadedAccountsExpectedValue: BankAccountListById = {
                '123456789': [LoadMultipleAccountsTest_Expected[0]],
                '987654321': [LoadMultipleAccountsTest_Expected[1]]
            }

            const loadOfxFileSpy = vi
                .spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[0])
                .mockRejectedValueOnce('Error')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[1])

            const accountLoadError = (filename: string, error: unknown) => {}
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError)

            const accountLoaded = (id: string, filename: string, account: BankAccount) => {}
            const accountLoadedMock = vi.fn().mockImplementation(accountLoaded)

            bankAccountLoader.accountLoadError = accountLoadErrorMock
            bankAccountLoader.accountLoaded = accountLoadedMock
            await bankAccountLoader.load(files)

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(3)
            expect(accountLoadErrorMock).toHaveBeenCalledTimes(1)
            expect(accountLoadErrorMock).toHaveBeenCalledWith('test2.ofx', 'Error')
            expect(accountLoadedMock).toHaveBeenCalledTimes(2)
            expect(accountLoadedMock).toHaveBeenCalledWith(LoadMultipleAccountsTest_Input[0])
            expect(accountLoadedMock).toHaveBeenCalledWith(LoadMultipleAccountsTest_Input[1])
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue)
        })

        test('multiple accounts sorted by account id', async () => {
            const files: File[] = [
                new File([''], 'test.ofx'),
                new File([''], 'test2.ofx'),
                new File([''], 'test3.ofx'),
                new File([''], 'test4.ofx')
            ]

            const loadedAccountsExpectedValue: BankAccountListById = {
                '123456789': [
                    LoadSortLoadedAccountByIdTest_Expected[0],
                    LoadSortLoadedAccountByIdTest_Expected[1]
                ],
                '987654321': [
                    LoadSortLoadedAccountByIdTest_Expected[2],
                    LoadSortLoadedAccountByIdTest_Expected[3]
                ]
            }

            const loadOfxFileSpy = vi
                .spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[0])
                .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[1])
                .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[2])
                .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[3])

            await bankAccountLoader.load(files)

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(4)
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue)
        })
    })

    describe('sanitize', async () => {
        test('success path', async () => {
            const combineAndSortTransactionsGroupSpy = vi
                .spyOn(bankAccountLoader, 'combineAndSortTransactionsGroups')
                .mockReturnValue(combineAndSortTransactionsGroup_success_expected)

            const sanitizeNewAccountsSpy = vi
                .spyOn(bankAccountLoader, 'sanitizeNewAccounts')
                .mockReturnValue(sanitizeNewAccounts_accountsById_expected_data)

            bankAccountLoader.sanitize({})

            expect(combineAndSortTransactionsGroupSpy).toHaveBeenCalledTimes(1)
            expect(sanitizeNewAccountsSpy).toHaveBeenCalledTimes(1)
            expect(sanitizeNewAccountsSpy).toHaveBeenCalledWith(
                {},
                combineAndSortTransactionsGroup_success_expected
            )
        })
    })

    describe('accountsById', async () => {
        test('returns content of sanitizedAccountsById', async () => {
            bankAccountLoader.sanitizedAccountsById = accountsById_test_data

            const result = bankAccountLoader.accountsById

            expect(result).toEqual(accountsById_test_data)
        })
    })

    describe('detectDuplicateTransactions', () => {
        test('should detect duplicate transactions based on transaction ID', () => {
            // Set up a mock bank account with duplicate transactions
            const date1 = new Date('2023-01-15')
            const date2 = new Date('2023-01-20')

            const account: BankAccount = {
                name: 'Test Account',
                accountId: '12345',
                accountType: 'checking',
                transactions: [
                    {
                        transactionId: 'trans1', // First occurrence of this ID
                        transactionGroupId: 'group1',
                        dateInscription: date1,
                        amount: 100,
                        type: 'DEPOSIT',
                        description: 'Paycheck'
                    },
                    {
                        transactionId: 'trans1', // Duplicate ID - should be detected as duplicate
                        transactionGroupId: 'group2',
                        dateInscription: date2,
                        amount: 200,
                        type: 'DEPOSIT',
                        description: 'Different Paycheck'
                    },
                    {
                        transactionId: 'trans3',
                        transactionGroupId: 'group1',
                        dateInscription: date1,
                        amount: 100,
                        type: 'DEPOSIT',
                        description: 'Not a duplicate'
                    },
                    {
                        transactionId: 'trans4',
                        transactionGroupId: 'group1',
                        dateInscription: date2,
                        amount: 100,
                        type: 'DEPOSIT',
                        description: 'Not a duplicate'
                    }
                ],
                transactionsGroups: []
            }

            // Create a new instance of BankAccountLoader with mocked dependencies
            const loader = new BankAccountLoader(
                ofxToBankAccount,
                csvToBankAccount,
                bankAccountOperations,
                bankAccountTransactionsSanitizerFactory,
                streamFactory,
                csvParser
            )

            // Use reflection or call private method through any cast to test the method
            const detectDuplicateTransactionsMethod = (
                loader as any
            ).detectDuplicateTransactions.bind(loader)
            const duplicates = detectDuplicateTransactionsMethod(account)

            // Assert that only one duplicate was found
            expect(duplicates).toHaveLength(1)
            expect(duplicates[0].transactionId).toBe('trans1')
            expect(duplicates[0].invalidReason).toBe(InvalidTransactionReason.duplicate)
        })
    })

    describe('createStatementFromAccount', () => {
        test('should include duplicate transactions in the statement', () => {
            // Set up a mock bank account with duplicate transactions
            const date1 = new Date('2023-01-15')
            const date2 = new Date('2023-01-20')

            const account: BankAccount = {
                name: 'Test Account',
                accountId: '12345',
                accountType: 'checking',
                transactions: [
                    {
                        transactionId: 'trans1', // This ID appears twice
                        transactionGroupId: 'group1',
                        dateInscription: date1,
                        amount: 100,
                        type: 'DEPOSIT',
                        description: 'Paycheck'
                    },
                    {
                        transactionId: 'trans1', // Duplicate transaction ID
                        transactionGroupId: 'group2',
                        dateInscription: date2,
                        amount: 200,
                        type: 'DEPOSIT',
                        description: 'Different transaction'
                    }
                ],
                transactionsGroups: []
            }

            // Create a new instance of BankAccountLoader with mocked dependencies
            const loader = new BankAccountLoader(
                ofxToBankAccount,
                csvToBankAccount,
                bankAccountOperations,
                bankAccountTransactionsSanitizerFactory,
                streamFactory,
                csvParser
            )

            // Use reflection or call private method through any cast to test the method
            const createStatementMethod = (loader as any).createStatementFromAccount.bind(loader)
            const statement = createStatementMethod(account, 'test-file.csv')

            // Assert that the statement has the duplicate transactions array
            expect(statement).toBeDefined()
            expect(statement.duplicateTransactions).toBeDefined()
            expect(statement.duplicateTransactions).toHaveLength(1)
            expect(statement.duplicateTransactions[0].transactionId).toBe('trans1')
            expect(statement.duplicateTransactions[0].invalidReason).toBe(
                InvalidTransactionReason.duplicate
            )
            expect(statement.filename).toBe('test-file.csv')
            expect(statement.numberOfTransactions).toBe(2) // All transactions are still included in the count
        })
    })

    describe('cross-statement duplicate detection', () => {
        test('should detect duplicates across multiple statements', async () => {
            // Set up two bank accounts with transactions that have the same ID
            const date1 = new Date('2023-01-15')
            const date2 = new Date('2023-02-15')

            const account1: BankAccount = {
                name: 'Test Account 1',
                accountId: '12345',
                accountType: 'checking',
                transactions: [
                    {
                        transactionId: 'shared-id-1', // This ID will appear in both accounts
                        transactionGroupId: 'group1',
                        dateInscription: date1,
                        amount: 100,
                        type: 'DEPOSIT',
                        description: 'First transaction'
                    },
                    {
                        transactionId: 'unique-id-1',
                        transactionGroupId: 'group1',
                        dateInscription: date1,
                        amount: 200,
                        type: 'DEPOSIT',
                        description: 'Second transaction'
                    }
                ],
                transactionsGroups: []
            }

            const account2: BankAccount = {
                name: 'Test Account 2',
                accountId: '12345', // Same account ID
                accountType: 'checking',
                transactions: [
                    {
                        transactionId: 'shared-id-1', // This matches a transaction ID in account1
                        transactionGroupId: 'group2',
                        dateInscription: date2,
                        amount: 300,
                        type: 'DEPOSIT',
                        description: 'Different description'
                    },
                    {
                        transactionId: 'unique-id-2',
                        transactionGroupId: 'group2',
                        dateInscription: date2,
                        amount: 400,
                        type: 'WITHDRAWAL',
                        description: 'Fourth transaction'
                    }
                ],
                transactionsGroups: []
            }

            // Set up test files and mock the loadFile method
            const files = [new File([''], 'file1.ofx'), new File([''], 'file2.ofx')]

            // Create a new instance of BankAccountLoader with mocked dependencies
            const loader = new BankAccountLoader(
                ofxToBankAccount,
                csvToBankAccount,
                bankAccountOperations,
                bankAccountTransactionsSanitizerFactory,
                streamFactory,
                csvParser
            )

            // Mock the loadFile method to return our test accounts
            vi.spyOn(loader, 'loadFile')
                .mockImplementationOnce(async () => Promise.resolve(account1))
                .mockImplementationOnce(async () => Promise.resolve(account2))

            // Load the files
            const statements = await loader.load(files)

            // Assert that two statements were created
            expect(statements).toHaveLength(2)

            // First statement should have no duplicates as it's processed first
            expect(statements[0].duplicateTransactions).toHaveLength(0)

            // Second statement should have one duplicate that matches the ID from the first statement
            expect(statements[1].duplicateTransactions).toHaveLength(1)
            expect(statements[1].duplicateTransactions[0].transactionId).toBe('shared-id-1')
            expect(statements[1].duplicateTransactions[0].invalidReason).toBe(
                InvalidTransactionReason.duplicate
            )
        })
    })

    describe('loadWithAccount duplicate detection with existing account', () => {
        test('should detect duplicates from the input account', async () => {
            // Create a transaction that will be considered a duplicate
            const existingDate = new Date('2023-03-10')
            const newDate = new Date('2023-03-15')
            const existingAccount: BankAccount = {
                name: 'Existing Account',
                accountId: '12345',
                accountType: 'checking',
                transactions: [
                    {
                        transactionId: 'existing-trans-1', // This ID should be detected as a duplicate
                        transactionGroupId: 'group1',
                        dateInscription: existingDate,
                        amount: 100,
                        type: 'DEPOSIT',
                        description: 'Existing transaction'
                    }
                ],
                transactionsGroups: []
            }

            // Mock streamFactory implementation
            const streamFactoryMock: IStreamFactory = {
                createFileReader: () => {
                    return {
                        read: async () => {
                            return 'Date,Description,Amount,ID\n2023-03-15,New Transaction,200,existing-trans-1\n2023-03-20,Another Transaction,300,new-trans-1'
                        }
                    }
                }
            }

            // Mock csvParser implementation
            const csvParserMock: ICsvParser = {
                parse: (text: string) => {
                    return {
                        ignoredLines: [],
                        content: {
                            header: {
                                records: ['Date', 'Description', 'Amount', 'ID']
                            },
                            rows: [
                                {
                                    lineNumber: 1,
                                    records: [
                                        '2023-03-15',
                                        'New Transaction',
                                        '200',
                                        'existing-trans-1'
                                    ]
                                },
                                {
                                    lineNumber: 2,
                                    records: [
                                        '2023-03-20',
                                        'Another Transaction',
                                        '300',
                                        'new-trans-1'
                                    ]
                                }
                            ]
                        }
                    }
                },
                minimumColumnsCount: 3,
                delimiter: ','
            }

            // Mock csvToBankAccount implementation
            const csvToBankAccountMock: ICsvToBankAccount = {
                loadCsvFile: vi.fn(),
                convertToBankAccountTransactionsGroup: (csvContent, columnsMapping) => {
                    return {
                        transactionsGroup: {
                            id: 'group2',
                            name: 'Test Group',
                            dateStart: newDate,
                            dateEnd: new Date('2023-03-20'),
                            filename: 'test-file.csv',
                            transactions: [
                                {
                                    transactionId: 'existing-trans-1', // Will be a duplicate
                                    transactionGroupId: 'group2',
                                    dateInscription: newDate,
                                    amount: 200,
                                    type: 'DEPOSIT',
                                    description: 'New Transaction'
                                },
                                {
                                    transactionId: 'new-trans-1', // Not a duplicate
                                    transactionGroupId: 'group2',
                                    dateInscription: new Date('2023-03-20'),
                                    amount: 300,
                                    type: 'DEPOSIT',
                                    description: 'Another Transaction'
                                }
                            ]
                        },
                        transactions: [
                            {
                                transactionId: 'existing-trans-1', // Will be a duplicate
                                transactionGroupId: 'group2',
                                dateInscription: newDate,
                                amount: 200,
                                type: 'DEPOSIT',
                                description: 'New Transaction'
                            },
                            {
                                transactionId: 'new-trans-1', // Not a duplicate
                                transactionGroupId: 'group2',
                                dateInscription: new Date('2023-03-20'),
                                amount: 300,
                                type: 'DEPOSIT',
                                description: 'Another Transaction'
                            }
                        ]
                    }
                }
            }

            // Create a loader with our mocks
            const loader = new BankAccountLoader(
                ofxToBankAccount,
                csvToBankAccountMock,
                bankAccountOperations,
                bankAccountTransactionsSanitizerFactory,
                streamFactoryMock,
                csvParserMock
            )

            // Create a mock file
            const mockFile = new File([''], 'test-file.csv')

            // Create a mock CSVColumnContentMapping
            const mockCsvMapping = {
                [CSVColumnContent.CARD_NUMBER]: 0,
                [CSVColumnContent.DATE_INSCRIPTION]: 0,
                [CSVColumnContent.DATE_TRANSACTION]: 0,
                [CSVColumnContent.AMOUNT]: 2,
                [CSVColumnContent.DESCRIPTION]: 1,
                [CSVColumnContent.TYPE]: null
            }

            // Call loadWithAccount with our existing account and mock file
            const statements = await loader.loadWithAccount(existingAccount, mockCsvMapping, [
                mockFile
            ])

            // Verify that one statement was created
            expect(statements).toHaveLength(1)

            // Verify that the duplicate was correctly identified
            expect(statements[0].duplicateTransactions).toHaveLength(1)
            expect(statements[0].duplicateTransactions[0].transactionId).toBe('existing-trans-1')
            expect(statements[0].duplicateTransactions[0].invalidReason).toBe(
                InvalidTransactionReason.duplicate
            )
        })
    })
})
