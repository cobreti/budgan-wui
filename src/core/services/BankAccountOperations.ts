import { injectable } from "inversify";
import type { BankAccount } from "../models/BankAccountTypes";


export interface IBankAccountOperations {
    getTransactionsInBothAccounts(account: BankAccount, otherAccount: BankAccount) : Set<string>;
    removeTransactionsFromBankAccount(account: BankAccount, transactionsToRemove: Set<string>) : void;
}


@injectable()
export class BankAccountOperations implements IBankAccountOperations {
    
    getTransactionsInBothAccounts(account: BankAccount, otherAccount: BankAccount) : Set<string> {

        if (account.accountId != otherAccount.accountId) {
            throw new Error('Account Ids do not match');
        }

        const accountTransactions = account.transactions.flatMap((group) => group.transactions);
        const otherAccountTransactions = otherAccount.transactions.flatMap((group) => group.transactions);
    
        const otherAccountTransactionsIds = new Set(otherAccountTransactions.map((transaction) => transaction.transactionId));
    
        const intersection = accountTransactions
          .filter((transaction) => otherAccountTransactionsIds.has(transaction.transactionId))
          .map((transaction) => transaction.transactionId);
          
        return new Set(intersection);
    }
    
    removeTransactionsFromBankAccount(account: BankAccount, transactionsToRemove: Set<string>) : void {
        account.transactions.forEach((group) => {
            group.transactions = group.transactions.filter((transaction) => !transactionsToRemove.has(transaction.transactionId));
        });

        account.transactions = account.transactions.filter((group) => group.transactions.length > 0);
    }
}

