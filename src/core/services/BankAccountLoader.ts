import { type IOfxToBankAccount } from './OfxToBankAccount';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ServicesTypes } from './types';
import type { IIdGenerator } from './IdGenerator';
import type { BankAccount } from '../models/BankAccountTypes';


export type LoadedAccount = {
    id: string;
    filename: string;
    account: BankAccount;
}

export type LoadedAccountsById = {[id: string]: LoadedAccount[]};


export interface IBankAccountLoader {

    loadingFileStarted : BankAccountLoader_LoadingFileStarted | undefined;
    accountLoaded : BankAccountLoader_AccountLoaded | undefined;

    load(files: File[]) : Promise<void>;
};


export type BankAccountLoader_LoadingFileStarted = (filename: string) => void;
export type BankAccountLoader_AccountLoaded = (id: string, filename: string, account: BankAccount) => void;
export type BankAccountLoader_AccountLoadError = (filename: string, error: unknown) => void;


@injectable()
export class BankAccountLoader implements IBankAccountLoader {

    loadedAccounts: LoadedAccountsById = {};

    loadingFileStarted : BankAccountLoader_LoadingFileStarted | undefined;
    accountLoaded : BankAccountLoader_AccountLoaded | undefined;
    accountLoadError : BankAccountLoader_AccountLoadError | undefined;

    constructor(
        @inject(ServicesTypes.OfxToBankAccount) private ofxToBankAccount: IOfxToBankAccount,
        @inject(ServicesTypes.IdGenerator) private idGenerator: IIdGenerator,
    ) {
        
    }

    public async load(files: File[]) {
        for (const file of files) {
            this.loadingFileStarted && this.loadingFileStarted(file.name);
      
            try {
                const account = await this.ofxToBankAccount.loadOfxFile(file);
                const id = this.idGenerator.generateId();

                const accountId = account.accountId;
                const loadedAccount = {
                    id,
                    filename: file.name,
                    account
                };

                const accountsForId = this.loadedAccounts[accountId] || [];
                accountsForId.push(loadedAccount);
                this.loadedAccounts[accountId] = accountsForId;

                this.accountLoaded && this.accountLoaded(id, file.name, account);
            } catch (error) {
                this.accountLoadError && this.accountLoadError(file.name, error);
            }
        }
    }
}

