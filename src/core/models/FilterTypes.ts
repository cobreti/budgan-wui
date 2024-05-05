import type { BankAccount, BankAccountTransaction, TransactionIdsTable } from '@models/BankAccountTypes'

export type FilteredTransaction = BankAccountTransaction & {
  bankAccountId?: string;
  transactionGroupId?: string;
}

export type FilteredTransactions = {
  dateStart?: Date;
  dateEnd?: Date;
  transactions: FilteredTransaction[];
  transactionsIds?: TransactionIdsTable;
}

export type TransactionsFilterFct = (account: BankAccount) => FilteredTransactions;
