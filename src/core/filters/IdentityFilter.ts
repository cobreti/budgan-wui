import type { BankAccount, TransactionIdsTable } from '@models/BankAccountTypes'
import type { FilteredTransactions, TransactionsFilterFct } from '@models/FilterTypes'

export const IdentityFilter: TransactionsFilterFct = (
    account: BankAccount | undefined
): FilteredTransactions => {
    if (!account || !account.transactions || account.transactions.length === 0) {
        // If no transactions, return empty object
        return {
            dateStart: undefined,
            dateEnd: undefined,
            transactions: [],
            transactionsIds: {}
        }
    }

    const initialDate = account.transactions[0].dateInscription

    const minDate = account.transactions.reduce((min, transaction) => {
        const transactionDate = transaction.dateInscription
        if (transactionDate < min) {
            return transactionDate
        }
        return min
    }, initialDate)

    const maxDate = account.transactions.reduce((max, transaction) => {
        const transactionDate = transaction.dateInscription
        if (transactionDate > max) {
            return transactionDate
        }
        return max
    }, initialDate)

    const transactionsIds = account.transactions.reduce((acc, transaction) => {
        acc[transaction.transactionId] = {}
        return acc
    }, {} as TransactionIdsTable)

    return {
        dateStart: minDate,
        dateEnd: maxDate,
        transactions: account.transactions,
        transactionsIds
    }
}
