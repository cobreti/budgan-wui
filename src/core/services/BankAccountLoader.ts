import { type IOfxToBankAccount } from './OfxToBankAccount';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { ServicesTypes } from './types';
import type { BankAccount, BankAccountsDictionary } from '@models/BankAccountTypes';
import type { IBankAccountOperations } from './BankAccountOperations';
import type { BankAccountTransactionsSanitizerFactory } from './BankAccountTransactionsSanitizerFactory';
import type { ICsvToBankAccount } from '@services/CsvToBankAccount'


export type BankAccountListById = {[id: string]: BankAccount[]};


export interface IBankAccountLoader {

    loadingFileStarted : BankAccountLoader_LoadingFileStarted | undefined;
    accountLoaded : BankAccountLoader_AccountLoaded | undefined;

    load(files: File[]) : Promise<void>;
    sanitize(accounts: BankAccountsDictionary) : void;

    get accountsById(): BankAccountsDictionary;
}


export type BankAccountLoader_LoadingFileStarted = (filename: string) => void;
export type BankAccountLoader_AccountLoaded = (account: BankAccount) => void;
export type BankAccountLoader_AccountLoadError = (filename: string, error: unknown) => void;


@injectable()
export class BankAccountLoader implements IBankAccountLoader {

    rawAccountsLoadedById: BankAccountListById = {};
    sanitizedAccountsById: BankAccountsDictionary = {};

    loadingFileStarted : BankAccountLoader_LoadingFileStarted | undefined;
    accountLoaded : BankAccountLoader_AccountLoaded | undefined;
    accountLoadError : BankAccountLoader_AccountLoadError | undefined;

    constructor(
        @inject(ServicesTypes.OfxToBankAccount) private ofxToBankAccount: IOfxToBankAccount,
        @inject(ServicesTypes.CsvToBankAccount) private csvToBankAccount: ICsvToBankAccount,
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
                const account = await this.loadFile(file);
                if (account.transactionsGroups.length > 0) {
                    account.transactionsGroups[0].filename = file.name;
                }

                const accountId = account.accountId;

                const accountsForId = this.rawAccountsLoadedById[accountId] || [];
                accountsForId.push(account);
                this.rawAccountsLoadedById[accountId] = accountsForId;

                this.accountLoaded && this.accountLoaded(account);
            } catch (error) {
                this.accountLoadError && this.accountLoadError(file.name, error);
            }
        }
    }

    public async loadFile(file: File)  : Promise<BankAccount> {
        const reOfx = /\.ofx$/i;
        const reCsv = /\.csv$/i;

        if (reOfx.test(file.name)) {
            return await this.ofxToBankAccount.loadOfxFile(file);
        } else if (reCsv.test(file.name)) {
            return await this.csvToBankAccount.loadCsvFile(file);
        } else {
            throw new Error('Unsupported file type');
        }
    }

    public sanitize(accounts: BankAccountsDictionary) {
        
        const newAccounts = this.combineAndSortTransactionsGroups();

        this.sanitizedAccountsById = this.sanitizeNewAccounts(accounts, newAccounts);
    }

    public combineAndSortTransactionsGroups() : BankAccountsDictionary {
        const accountsById : BankAccountsDictionary = {};

        for (const accountId in this.rawAccountsLoadedById) {
            const loadedAccounts = this.rawAccountsLoadedById[accountId];
            const combinedGroups = this.bankAccountOperations.getCombinedTransactionsGroup(...loadedAccounts);
            const sortedGroups = this.bankAccountOperations.sortTransactionsGroupByStartDateAscending(combinedGroups);
            const account = loadedAccounts[0];
            accountsById[account.accountId] = {
                ...account,
                transactionsGroups: sortedGroups
            };
        }

        return accountsById;
    }

    public sanitizeNewAccounts(existingAccounts: BankAccountsDictionary, newAccounts: BankAccountsDictionary) : BankAccountsDictionary {

        const sanitizedAccountsById : BankAccountsDictionary = {};

        for (const id in newAccounts) {
            const sanitizer = this.bankAccountTransactionsSanitizerFactory.create(existingAccounts[id]);

            const account = newAccounts[id];
            for (const group of account.transactionsGroups) {
                sanitizer.addTransactionsGroup(group);
            }
            account.transactionsGroups = sanitizer.transactionsGroups;

            sanitizedAccountsById[id] = account;
        }

        return sanitizedAccountsById;
    }
}

