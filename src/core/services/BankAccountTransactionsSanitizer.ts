import "reflect-metadata";

import { injectable } from 'inversify'
import type { BankAccount, BankAccountTransactionsGroup, TransactionIdsTable } from '@models/BankAccountTypes'

export interface IBankAccountTransactionsSanitizer {
  initWithAccount(account: BankAccount) : void;
  getTransactionsIdsForAccount(account: BankAccount) : TransactionIdsTable;
}

@injectable()
export class BankAccountTransactionsSanitizer implements IBankAccountTransactionsSanitizer {

  public accountId_ : string | undefined;
  public transactionsIds_ : TransactionIdsTable = {};
  public transactionsGroups_ : BankAccountTransactionsGroup[] = [];

  public initWithAccount(account : BankAccount) : void {
    if (this.accountId_ != undefined) {
      throw new Error('Account already initialized');
    }

    this.accountId_ = account.accountId;
    this.transactionsIds_ = this.getTransactionsIdsForAccount(account);
  }

  public getTransactionsIdsForAccount(account: BankAccount) : TransactionIdsTable {
    return account.transactionsGroups.reduce((acc, group) => {
      group.transactions.forEach((transaction) => {
        acc[transaction.transactionId] = {};
      });
      return acc;
    }, {} as TransactionIdsTable);
  }
}
