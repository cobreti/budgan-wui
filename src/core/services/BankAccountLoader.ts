import { type IOfxToBankAccount } from './OfxToBankAccount';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ServicesTypes } from './types';
import type { IIdGenerator } from './IdGenerator';
import type { BankAccount, BankAccountsDictionary } from '@models/BankAccountTypes';
import type { IBankAccountOperations } from './BankAccountOperations';
import type { BankAccountTransactionsSanitizerFactory } from './BankAccountTransactionsSanitizerFactory';


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
    sanitize(accounts: BankAccountsDictionary) : void;

    get accountsById(): BankAccountsDictionary;
};


export type BankAccountLoader_LoadingFileStarted = (filename: string) => void;
export type BankAccountLoader_AccountLoaded = (id: string, filename: string, account: BankAccount) => void;
export type BankAccountLoader_AccountLoadError = (filename: string, error: unknown) => void;


@injectable()
export class BankAccountLoader implements IBankAccountLoader {

    rawAccountsLoadedById: LoadedAccountsById = {};
    sanitizedAccountsById: BankAccountsDictionary = {};

    loadingFileStarted : BankAccountLoader_LoadingFileStarted | undefined;
    accountLoaded : BankAccountLoader_AccountLoaded | undefined;
    accountLoadError : BankAccountLoader_AccountLoadError | undefined;

    constructor(
        @inject(ServicesTypes.OfxToBankAccount) private ofxToBankAccount: IOfxToBankAccount,
        @inject(ServicesTypes.IdGenerator) private idGenerator: IIdGenerator,
        @inject(ServicesTypes.BankAccountOperations) private bankAccountOperations: IBankAccountOperations,
        @inject(ServicesTypes.BankAccountTransactionsSanitizerFactory) private bankAccountTransactionsSanitizerFactory: BankAccountTransactionsSanitizerFactory,
    ) {
        
    }

    get accountsById() : BankAccountsDictionary {
        return this.sanitizedAccountsById;
    }

    public async load(files: File[]) {
        for (const file of files) {
            this.loadingFileStarted && this.loadingFileStarted(file.name);
      
            try {
                const account = await this.ofxToBankAccount.loadOfxFile(file);
                if (account.transactionsGroups.length > 0) {
                    account.transactionsGroups[0].filename = file.name;
                }
                const id = this.idGenerator.generateId();

                const accountId = account.accountId;
                const loadedAccount = {
                    id,
                    filename: file.name,
                    account
                };

                const accountsForId = this.rawAccountsLoadedById[accountId] || [];
                accountsForId.push(loadedAccount);
                this.rawAccountsLoadedById[accountId] = accountsForId;

                this.accountLoaded && this.accountLoaded(id, file.name, account);
            } catch (error) {
                this.accountLoadError && this.accountLoadError(file.name, error);
            }
        }
    }

    public sanitize(accounts: BankAccountsDictionary) {
        
        const newAccounts = this.combineAndSortTransactionsGroups();

        this.sanitizeNewAccounts(accounts, newAccounts);
    }

    public combineAndSortTransactionsGroups() : BankAccountsDictionary {
        const accountsById : BankAccountsDictionary = {};

        for (const accountId in this.rawAccountsLoadedById) {
            const loadedAccounts = this.rawAccountsLoadedById[accountId];
            const combinedGroups = this.bankAccountOperations.getCombinedTransactionsGroup(...loadedAccounts.map((loadedAccount) => loadedAccount.account));
            const sortedGroups = this.bankAccountOperations.sortTransactionsGroupByStartDateAscending(combinedGroups);
            const account = loadedAccounts[0].account;
            accountsById[account.accountId] = {
                ...account,
                transactionsGroups: sortedGroups
            };
        }

        return accountsById;
    }

    public sanitizeNewAccounts(existingAccounts: BankAccountsDictionary, newAccounts: BankAccountsDictionary) {

        for (const id in newAccounts) {
            const sanitizer = this.bankAccountTransactionsSanitizerFactory.create(existingAccounts[id]);

            const account = newAccounts[id];
            for (const group of account.transactionsGroups) {
                sanitizer.addTransactionsGroup(group);
            }
            account.transactionsGroups = sanitizer.transactionsGroups;

            this.sanitizedAccountsById[id] = account;
        }

    }
}

