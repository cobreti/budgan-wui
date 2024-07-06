import { BankAccountLoader, type LoadedAccount } from '@services/BankAccountLoader';
import { type IIdGenerator } from './IdGenerator';
import { type IOfxToBankAccount } from './OfxToBankAccount';
import { type BankAccount } from '@models/BankAccountTypes';
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { LoadMultipleAccountsTest_Input, LoadSingleFileTestSuccess_Input } from './tests-files/BankAccountLoader/load-test-data';

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

    let bankAccountLoader : BankAccountLoader = {} as BankAccountLoader;

    beforeEach( async() => {
        bankAccountLoader = new BankAccountLoader(ofxToBankAccount, idGenerator);
    });

    afterEach( async() => {
        vi.resetAllMocks();
    })

    describe('load', async () => {

        test('single file success path', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const id = '123';
            const loadedAccountsExepectedValue = [
                {
                    id,
                    filename: 'test.ofx',
                    account: LoadSingleFileTestSuccess_Input
                }
            ];

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValue(LoadSingleFileTestSuccess_Input);

            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValue(id);

            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(generateIdSpy).toHaveBeenCalledTimes(1);
            expect(bankAccountLoader.loadedAccounts).toEqual(loadedAccountsExepectedValue);
        });

        test('single file with failure', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const id = '123';
            const loadedAccountsExepectedValue : LoadedAccount[] = [];

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error');

            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValue(id);

            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(generateIdSpy).not.toHaveBeenCalled();
            expect(bankAccountLoader.loadedAccounts).toEqual(loadedAccountsExepectedValue);
        });

        test('single file with failure and error callback', async () => {
            const files: File[] = [
                new File([''], 'test.ofx')
            ];
            const id = '123';
            const loadedAccountsExepectedValue : LoadedAccount[] = [];

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockRejectedValue('Error');

            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValue(id);

            const accountLoadError = (filename: string, error: unknown) => {};
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError);

            bankAccountLoader.accountLoadError = accountLoadErrorMock;
            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(1);
            expect(generateIdSpy).not.toHaveBeenCalled();
            expect(accountLoadErrorMock).toHaveBeenCalledTimes(1);
            expect(accountLoadErrorMock).toHaveBeenCalledWith('test.ofx', 'Error');
            expect(bankAccountLoader.loadedAccounts).toEqual(loadedAccountsExepectedValue);
        });


        test('multiple files with success and failure', async () => {
            const files: File[] = [
                new File([''], 'test.ofx'),
                new File([''], 'test2.ofx'),
                new File([''], 'test3.ofx')
            ];
            const ids = ['123', '456'];

            const loadedAccountsExepectedValue : LoadedAccount[] = [
                {
                    id: ids[0],
                    filename: 'test.ofx',
                    account: LoadMultipleAccountsTest_Input[0]
                },
                {
                    id: ids[1],
                    filename: 'test3.ofx',
                    account: LoadMultipleAccountsTest_Input[1]
                }
            ];

            const loadOfxFileSpy = vi.spyOn(ofxToBankAccount, 'loadOfxFile')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[0])
                .mockRejectedValueOnce('Error')
                .mockResolvedValueOnce(LoadMultipleAccountsTest_Input[1])


            const generateIdSpy = vi.spyOn(idGenerator, 'generateId')
                .mockReturnValueOnce(ids[0])
                .mockReturnValueOnce(ids[1]);

            const accountLoadError = (filename: string, error: unknown) => {};
            const accountLoadErrorMock = vi.fn().mockImplementation(accountLoadError);

            const accountLoaded = (id: string, filename: string, account: BankAccount) => {};
            const accountLoadedMock = vi.fn().mockImplementation(accountLoaded);

            bankAccountLoader.accountLoadError = accountLoadErrorMock;
            bankAccountLoader.accountLoaded = accountLoadedMock;
            await bankAccountLoader.load(files);

            expect(loadOfxFileSpy).toHaveBeenCalledTimes(3);
            expect(generateIdSpy).toHaveBeenCalledTimes(2);
            expect(accountLoadErrorMock).toHaveBeenCalledTimes(1);
            expect(accountLoadErrorMock).toHaveBeenCalledWith('test2.ofx', 'Error');
            expect(accountLoadedMock).toHaveBeenCalledTimes(2);
            expect(accountLoadedMock).toHaveBeenCalledWith(ids[0], 'test.ofx', LoadMultipleAccountsTest_Input[0]);
            expect(accountLoadedMock).toHaveBeenCalledWith(ids[1], 'test3.ofx', LoadMultipleAccountsTest_Input[1]);
            expect(bankAccountLoader.loadedAccounts).toEqual(loadedAccountsExepectedValue);
        });

    });
});
