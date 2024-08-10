import { BankAccountLoader, type BankAccountListById } from '@services/BankAccountLoader';
import { type IOfxToBankAccount } from './OfxToBankAccount';
import { type BankAccount, type BankAccountTransactionsGroup } from '@models/BankAccountTypes'
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
    LoadMultipleAccountsTest_Expected,
    LoadMultipleAccountsTest_Input,
    LoadSingleFileTestSuccess_Expected,
    LoadSingleFileTestSuccess_Input, LoadSortLoadedAccountByIdTest_Expected,
    LoadSortLoadedAccountByIdTest_Input
} from './tests-files/BankAccountLoader/load-test-data'
import type { IBankAccountOperations } from './BankAccountOperations';
import type { IBankAccountTransactionsSanitizerFactory } from './BankAccountTransactionsSanitizerFactory';
import type { IBankAccountTransactionsSanitizer } from './BankAccountTransactionsSanitizer';
import {
    combineAndSortTransactionsGroup_success_expected,
    combineAndSortTransactionsGroup_success_getCombinedTransactionsGroup_result,
    combineAndSortTransactionsGroup_success_input,
    combineAndSortTransactionsGroup_success_sortTransactionsGroupByStartDateAscending_result
} from '@services/tests-files/BankAccountLoader/combineAndSorteTransactionsGroup-test-data'
import { BankAccountTransactionsSanitizer } from './BankAccountTransactionsSanitizer'
import {
    sanitizeNewAccounts_accountsById_expected_data,
    sanitizeNewAccounts_existingAccount,
    sanitizeNewAccounts_newAccounts, sanitizeNewAccounts_transactionsGroups_account_123456789, sanitizeNewAccounts_transactionsGroups_account_987654321
} from '@services/tests-files/BankAccountLoader/sanitize-test-data'
import { accountsById_test_data } from '@services/tests-files/BankAccountLoader/accountsById-test-data'
import type { ICsvToBankAccount } from '@services/CsvToBankAccount'

describe('BankAccountLoader', async () => {

    const ofxToBankAccount : IOfxToBankAccount = {
        loadOfxFile: async (file: File) : Promise<BankAccount> => {
            return {} as BankAccount;
        }
    } as IOfxToBankAccount;

    const csvToBankAccount: ICsvToBankAccount = {

    } as ICsvToBankAccount;

    const bankAccountOperations : IBankAccountOperations = {
        getCombinedTransactionsGroup : (...accounts): BankAccountTransactionsGroup[] => {
            return [];
        },
        sortTransactionsGroupByStartDateAscending: (transactionsGroup: BankAccountTransactionsGroup[]): BankAccountTransactionsGroup[] => {
            return [];
        }
    } as IBankAccountOperations;

    const bankAccountTransactionsSanitizerFactory : IBankAccountTransactionsSanitizerFactory = {
        create: (account: BankAccount) => {
            return {} as IBankAccountTransactionsSanitizer;
        }
    } as IBankAccountTransactionsSanitizerFactory;

    let bankAccountLoader : BankAccountLoader = {} as BankAccountLoader;

    beforeEach( async() => {
        bankAccountLoader = new BankAccountLoader(ofxToBankAccount, csvToBankAccount, bankAccountOperations, bankAccountTransactionsSanitizerFactory);
    });

    afterEach( async() => {
        vi.resetAllMocks();
    })

    describe('load', async () => {

        test('single file success path', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const loadedAccountsExpectedValue = {
                '123456789': [
                    LoadSingleFileTestSuccess_Expected
                ]
            };

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValue(LoadSingleFileTestSuccess_Input);

            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });

        test('single file with failure', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const loadedAccountsExpectedValue : BankAccountListById = {};

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error');

            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });

        test('single file with failure and error callback', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const loadedAccountsExpectedValue : BankAccountListById = {};

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error');

            const accountLoadError = (filename: string, error: unknown) => {};
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError);

            bankAccountLoader.accountLoadError = accountLoadErrorMock;
            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(accountLoadErrorMock).toHaveBeenCalledTimes(1);
            expect(accountLoadErrorMock).toHaveBeenCalledWith('test.ofx', 'Error');
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });


        test('multiple files with success and failure', async () => {
            const files: File[] = [
                new File([''], 'test.ofx'),
                new File([''], 'test2.ofx'),
                new File([''], 'test3.ofx')
            ];

            const loadedAccountsExpectedValue : BankAccountListById = {
                '123456789': [
                        LoadMultipleAccountsTest_Expected[0]
                    ],
                '987654321': [
                        LoadMultipleAccountsTest_Expected[1]
                    ]
            };

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[0])
                .mockRejectedValueOnce('Error')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[1]);


            const accountLoadError = (filename: string, error: unknown) => {};
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError);

            const accountLoaded = (id: string, filename: string, account: BankAccount) => {};
            const accountLoadedMock = vi.fn().mockImplementation(accountLoaded);

            bankAccountLoader.accountLoadError = accountLoadErrorMock;
            bankAccountLoader.accountLoaded = accountLoadedMock;
            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(3);
            expect(accountLoadErrorMock).toHaveBeenCalledTimes(1);
            expect(accountLoadErrorMock).toHaveBeenCalledWith('test2.ofx', 'Error');
            expect(accountLoadedMock).toHaveBeenCalledTimes(2);
            expect(accountLoadedMock).toHaveBeenCalledWith(LoadMultipleAccountsTest_Input[0]);
            expect(accountLoadedMock).toHaveBeenCalledWith(LoadMultipleAccountsTest_Input[1]);
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });

        test('multiple accounts sorted by account id', async () => {
            const files: File[] = [
                new File([''], 'test.ofx'),
                new File([''], 'test2.ofx'),
                new File([''], 'test3.ofx'),
                new File([''], 'test4.ofx')
            ];

            const loadedAccountsExpectedValue : BankAccountListById = {
                '123456789': [
                    LoadSortLoadedAccountByIdTest_Expected[0],
                    LoadSortLoadedAccountByIdTest_Expected[1]
                ],
                '987654321': [
                    LoadSortLoadedAccountByIdTest_Expected[2],
                    LoadSortLoadedAccountByIdTest_Expected[3]
                ]
            };

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[0])
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[1])
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[2])
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[3]);

            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(4);
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });
    });

    describe('combineAndSortTransactionsGroup', async () => {

        test('success path', async () => {
            bankAccountLoader.rawAccountsLoadedById = combineAndSortTransactionsGroup_success_input;

            vi.spyOn(bankAccountOperations, 'getCombinedTransactionsGroup')
              .mockReturnValue(combineAndSortTransactionsGroup_success_getCombinedTransactionsGroup_result);
            vi.spyOn(bankAccountOperations, 'sortTransactionsGroupByStartDateAscending')
              .mockReturnValue(combineAndSortTransactionsGroup_success_sortTransactionsGroupByStartDateAscending_result);

            const result = bankAccountLoader.combineAndSortTransactionsGroups();

            expect(result).toEqual(combineAndSortTransactionsGroup_success_expected);
        });
    });

    describe('sanitizeNewAccounts', async () => {

        test('success path', async () => {
            const sanitizer_123456789: BankAccountTransactionsSanitizer = {
                accountId: '123456789',
                transactionsIds: {},
                rejectedGroups: [],
                initWithAccount: (account: BankAccount) => {
                },
                getTransactionsIdsForAccount: (account: BankAccount) => {
                    return {};
                },
                addTransactionsGroup: (group: BankAccountTransactionsGroup) => {
                },
                transactionsGroups: sanitizeNewAccounts_transactionsGroups_account_123456789
            } as BankAccountTransactionsSanitizer;

            const sanitizer_987654321: BankAccountTransactionsSanitizer = {
                accountId: '987654321',
                transactionsIds: {},
                rejectedGroups: [],
                initWithAccount: (account: BankAccount) => {
                },
                getTransactionsIdsForAccount: (account: BankAccount) => {
                    return {};
                },
                addTransactionsGroup: (group: BankAccountTransactionsGroup) => {
                },
                transactionsGroups: sanitizeNewAccounts_transactionsGroups_account_987654321
            } as BankAccountTransactionsSanitizer;

            const factoryCreateSpy = vi.spyOn(bankAccountTransactionsSanitizerFactory, 'create')
                .mockReturnValueOnce(sanitizer_123456789)
                .mockReturnValueOnce(sanitizer_987654321);

            const sanitizer_123456789_addTransactionsGroupSpy = vi.spyOn(sanitizer_123456789, 'addTransactionsGroup');
            const sanitizer_987654321_addTransactionsGroupSpy = vi.spyOn(sanitizer_987654321, 'addTransactionsGroup');

            const result = bankAccountLoader.sanitizeNewAccounts(sanitizeNewAccounts_existingAccount, sanitizeNewAccounts_newAccounts)

            expect(factoryCreateSpy).toHaveBeenCalledTimes(2);
            expect(factoryCreateSpy).toHaveBeenNthCalledWith(1, sanitizeNewAccounts_existingAccount['123456789']);
            expect(factoryCreateSpy).toHaveBeenNthCalledWith(2, undefined);

            expect(sanitizer_123456789_addTransactionsGroupSpy).toHaveBeenCalledTimes(2);
            expect(sanitizer_123456789_addTransactionsGroupSpy).toHaveBeenNthCalledWith(1, sanitizeNewAccounts_transactionsGroups_account_123456789[1]);
            expect(sanitizer_123456789_addTransactionsGroupSpy).toHaveBeenNthCalledWith(2, sanitizeNewAccounts_transactionsGroups_account_123456789[2]);

            expect(sanitizer_987654321_addTransactionsGroupSpy).toHaveBeenCalledTimes(2);
            expect(sanitizer_987654321_addTransactionsGroupSpy).toHaveBeenNthCalledWith(1, sanitizeNewAccounts_transactionsGroups_account_987654321[0]);
            expect(sanitizer_987654321_addTransactionsGroupSpy).toHaveBeenNthCalledWith(2, sanitizeNewAccounts_transactionsGroups_account_987654321[1]);

            expect(result).toEqual(sanitizeNewAccounts_accountsById_expected_data)
        });
    });

    describe('sanitize', async () => {

        test('success path', async () => {

            const combineAndSortTransactionsGroupSpy = vi.spyOn(bankAccountLoader, 'combineAndSortTransactionsGroups')
                .mockReturnValue(combineAndSortTransactionsGroup_success_expected);

            const sanitizeNewAccountsSpy = vi.spyOn(bankAccountLoader, 'sanitizeNewAccounts')
                .mockReturnValue(sanitizeNewAccounts_accountsById_expected_data);

            bankAccountLoader.sanitize({});

            expect(combineAndSortTransactionsGroupSpy).toHaveBeenCalledTimes(1);
            expect(sanitizeNewAccountsSpy).toHaveBeenCalledTimes(1);
            expect(sanitizeNewAccountsSpy).toHaveBeenCalledWith({}, combineAndSortTransactionsGroup_success_expected);
        });
    });

    describe('accountsById', async () => {

        test('returns content of sanitizedAccountsById', async () => {

            bankAccountLoader.sanitizedAccountsById = accountsById_test_data;

            const result = bankAccountLoader.accountsById;

            expect(result).toEqual(accountsById_test_data);
        });
    });
});
