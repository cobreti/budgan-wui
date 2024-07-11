import { BankAccountLoader, type BankAccountListById } from '@services/BankAccountLoader';
import { type IOfxToBankAccount } from './OfxToBankAccount';
import { type BankAccount } from '@models/BankAccountTypes';
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { LoadMultipleAccountsTest_Input, LoadSingleFileTestSuccess_Expected, LoadSingleFileTestSuccess_Input, LoadSortLoadedAccountByIdTest_Input } from './tests-files/BankAccountLoader/load-test-data';
import type { IBankAccountOperations } from './BankAccountOperations';
import type { IBankAccountTransactionsSanitizerFactory } from './BankAccountTransactionsSanitizerFactory';
import type { IBankAccountTransactionsSanitizer } from './BankAccountTransactionsSanitizer';

describe('BankAccountLoader', async () => {

    const ofxToBankAccount : IOfxToBankAccount = {
        loadOfxFile: async (file: File) : Promise<BankAccount> => {
            return {} as BankAccount;
        }
    } as IOfxToBankAccount;

    const bankAccountOperations : IBankAccountOperations = {
    } as IBankAccountOperations;

    const bankAccountTransactionsSanitizerFactory : IBankAccountTransactionsSanitizerFactory = {
        create: (account: BankAccount) => {
            return {} as IBankAccountTransactionsSanitizer;
        }
    } as IBankAccountTransactionsSanitizerFactory;

    let bankAccountLoader : BankAccountLoader = {} as BankAccountLoader;

    beforeEach( async() => {
        bankAccountLoader = new BankAccountLoader(ofxToBankAccount, bankAccountOperations, bankAccountTransactionsSanitizerFactory);
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
                        LoadMultipleAccountsTest_Input[0]
                    ],
                '987654321': [
                        LoadMultipleAccountsTest_Input[1]
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
                    LoadSortLoadedAccountByIdTest_Input[0],
                    LoadSortLoadedAccountByIdTest_Input[1]
                ],
                '987654321': [
                    LoadSortLoadedAccountByIdTest_Input[2],
                    LoadSortLoadedAccountByIdTest_Input[3]
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
});
