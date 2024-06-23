/**
 * Defines transaction Ids table.
 * 
 * Using key to store ids and an empty object assigned to this id
 * so it can be saved and restored automatically from browser session storage.
 * 
 */
export declare type TransactionIdsTable = {[key: string]: object};

export type BankAccountTransaction = {
    transactionId: string;
    date: Date;
    amount: number;
    type: string;
    description: string;
}

export enum InvalidTransactionReason {
    unknown = 'unknown',
    duplicate = 'duplicate',
}

export type BankAccountInvalidTransaction = BankAccountTransaction & {
    originalTransactionGroupId?: string;
    invalidReason: InvalidTransactionReason;
}

export type BankAccountTransactionsGroup = {
    name: string;
    id: string;
    dateStart: Date;
    dateEnd: Date;
    transactions: BankAccountTransaction[];
    invalidTransactions?: BankAccountInvalidTransaction[];
}

export type BankAccount = {
    name: string;
    accountId: string;
    accountType: string | undefined;
    transactionsGroups: BankAccountTransactionsGroup[];
}

export type BankAccountsDictionary = {[key: string]: BankAccount};

