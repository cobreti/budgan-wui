import type { BankAccount, TransactionIdsTable } from '@models/BankAccountTypes'
import type { FilteredTransactions, TransactionsFilterFct } from '@models/FilterTypes'

export const IdentityFilter : TransactionsFilterFct = (account: BankAccount | undefined) : FilteredTransactions => {
  if (!account) {
    return {
      dateStart: undefined,
      dateEnd: undefined,
      transactions: [],
      transactionsIds: {}
    }
  }

  let minDate: Date | undefined = undefined;
  let maxDate: Date | undefined = undefined;
  const transactionsIds : TransactionIdsTable = {};
  const transactions = account.transactionsGroups.flatMap(group => {
    minDate = minDate ? (group.dateStart < minDate ? group.dateStart : minDate) : group.dateStart;
    maxDate = maxDate ? (group.dateEnd > maxDate ? group.dateEnd : maxDate) : group.dateEnd;
    return group.transactions.map(transaction => {
      transactionsIds[transaction.transactionId] = {};
      return {
        ...transaction,
        bankAccountId: account.accountId,
        transactionGroupId: group.id
      }
    });
  });

  return {
    dateStart: minDate,
    dateEnd: maxDate,
    transactions,
    transactionsIds
  }
}
