import { BankAccountLoader, type LoadedAccountsById } from '@services/BankAccountLoader';
import { type IIdGenerator } from './IdGenerator';
import { type IOfxToBankAccount } from './OfxToBankAccount';
import { type BankAccount } from '@models/BankAccountTypes';
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { LoadMultipleAccountsTest_Input, LoadSingleFileTestSuccess_Input, LoadSortLoadedAccountByIdTest_Input } from './tests-files/BankAccountLoader/load-test-data';
import type { IBankAccountOperations } from './BankAccountOperations';
import type { IBankAccountTransactionsSanitizerFactory } from './BankAccountTransactionsSanitizerFactory';
import type { IBankAccountTransactionsSanitizer } from './BankAccountTransactionsSanitizer';

describe('BankAccountLoader', async () => {

    const ofxToBankAccount : IOfxToBankAccount = {
        loadOfxFile: async (file: File) : Promise<BankAccount> => {
            return {} as BankAccount;
        }
    } as IOfxToBankAccount;

    const idGenerator : IIdGenerator = {
        generateId: () : string => {
            return '';
        }
    } as IIdGenerator;

    const bankAccountOperations : IBankAccountOperations = {
    } as IBankAccountOperations;

    const bankAccountTransactionsSanitizerFactory : IBankAccountTransactionsSanitizerFactory = {
        create: (account: BankAccount) => {
            return {} as IBankAccountTransactionsSanitizer;
        }
    } as IBankAccountTransactionsSanitizerFactory;

    let bankAccountLoader : BankAccountLoader = {} as BankAccountLoader;

    beforeEach( async() => {
        bankAccountLoader = new BankAccountLoader(ofxToBankAccount, idGenerator, bankAccountOperations, bankAccountTransactionsSanitizerFactory);
    });

    afterEach( async() => {
        vi.resetAllMocks();
    })

    describe('loadFiles', async () => {

        test('single file success path', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const id = '123';
            const loadedAccountsExepectedValue = {
                '123456789': [
                    {
                        id,
                        filename: 'test.ofx',
                        account: LoadSingleFileTestSuccess_Input
                    }
                ]
            };

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValue(LoadSingleFileTestSuccess_Input);

            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValue(id);

            await bankAccountLoader.loadFiles(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(generateIdSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExepectedValue);
        });

        test('single file with failure', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const id = '123';
            const loadedAccountsExpectedValue : LoadedAccountsById = {};

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error');

            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValue(id);

            await bankAccountLoader.loadFiles(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(generateIdSpy).not.toHaveBeenCalled();
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });

        test('single file with failure and error callback', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const id = '123';
            const loadedAccountsExpectedValue : LoadedAccountsById = {};

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error');

            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValue(id);

            const accountLoadError = (filename: string, error: unknown) => {};
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError);

            bankAccountLoader.accountLoadError = accountLoadErrorMock;
            await bankAccountLoader.loadFiles(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(generateIdSpy).not.toHaveBeenCalled();
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
            const ids = ['123', '456'];

            const loadedAccountsExpectedValue : LoadedAccountsById = {
                '123456789': [
                    {
                        id: ids[0],
                        filename: 'test.ofx',
                        account: LoadMultipleAccountsTest_Input[0]
                    }],
                '987654321': [{
                    id: ids[1],
                    filename: 'test3.ofx',
                    account: LoadMultipleAccountsTest_Input[1]
                }]
            };

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[0])
                .mockRejectedValueOnce('Error')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[1]);


            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValueOnce(ids[0])
                .mockReturnValueOnce(ids[1]);

            const accountLoadError = (filename: string, error: unknown) => {};
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError);

            const accountLoaded = (id: string, filename: string, account: BankAccount) => {};
            const accountLoadedMock = vi.fn().mockImplementation(accountLoaded);

            bankAccountLoader.accountLoadError = accountLoadErrorMock;
            bankAccountLoader.accountLoaded = accountLoadedMock;
            await bankAccountLoader.loadFiles(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(3);
            expect(generateIdSpy).toHaveBeenCalledTimes(2);
            expect(accountLoadErrorMock).toHaveBeenCalledTimes(1);
            expect(accountLoadErrorMock).toHaveBeenCalledWith('test2.ofx', 'Error');
            expect(accountLoadedMock).toHaveBeenCalledTimes(2);
            expect(accountLoadedMock).toHaveBeenCalledWith(ids[0], 'test.ofx', LoadMultipleAccountsTest_Input[0]);
            expect(accountLoadedMock).toHaveBeenCalledWith(ids[1], 'test3.ofx', LoadMultipleAccountsTest_Input[1]);
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });

        test('multiple accounts sorted by account id', async () => {
            const files: File[] = [
                new File([''], 'test.ofx'),
                new File([''], 'test2.ofx'),
                new File([''], 'test3.ofx'),
                new File([''], 'test4.ofx')
            ];
            const ids = ['123', '456', '789', '1011'];

            const loadedAccountsExpectedValue : LoadedAccountsById = {
                '123456789': [
                    {
                        id: ids[0],
                        filename: 'test.ofx',
                        account: LoadSortLoadedAccountByIdTest_Input[0]
                    },
                    {
                        id: ids[1],
                        filename: 'test2.ofx',
                        account: LoadSortLoadedAccountByIdTest_Input[1]
                    }
                ],
                '987654321': [
                    {
                        id: ids[2],
                        filename: 'test3.ofx',
                        account: LoadSortLoadedAccountByIdTest_Input[2]
                    },
                    {
                        id: ids[3],
                        filename: 'test4.ofx',
                        account: LoadSortLoadedAccountByIdTest_Input[3]
                    }
                ]
            };

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[0])
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[1])
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[2])
            .mockResolvedValueOnce(LoadSortLoadedAccountByIdTest_Input[3]);


            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValueOnce(ids[0])
                .mockReturnValueOnce(ids[1])
                .mockReturnValueOnce(ids[2])
                .mockReturnValueOnce(ids[3]);


            await bankAccountLoader.loadFiles(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(4);
            expect(generateIdSpy).toHaveBeenCalledTimes(4);
            expect(bankAccountLoader.rawAccountsLoadedById).toEqual(loadedAccountsExpectedValue);
        });
    });
});
