import type { BankAccount, BankAccountTransaction } from '@models/BankAccountTypes'
import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'

// Define transaction type
export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
    Transfer = 'transfer',
    Other = 'other'
}

// Define month transaction structure
export type MonthTransactions = {
    income: BankAccountTransaction[]
    expense: BankAccountTransaction[]
    transfer: BankAccountTransaction[]
    other: BankAccountTransaction[]
    all: BankAccountTransaction[]
    totalIncome: number
    totalExpense: number
    totalTransfer: number
    totalOther: number
    balance: number
}

// Define year-month for grouping data
export type YearMonth = {
    year: number
    month: number
    key: string // Format: YYYY-MM
}

// Define monthly view data structure
export type MonthlyAccountView = {
    account: BankAccount | undefined
    months: Map<string, MonthTransactions> // Key format: YYYY-MM
    sortedMonthKeys: string[] // Array of month keys sorted chronologically
    allTransactions: BankAccountTransaction[]
}

// Define store interface
export type MonthlyAccountViewStore = {
    monthlyView: Ref<MonthlyAccountView>
    setBankAccountFromId: (id: string) => void
    addBankAccount: (bankAccount: BankAccount) => void
    clearMonthlyView: () => void
    getTransactionsByMonth: (yearMonth: string) => MonthTransactions | undefined
    totalIncome: (monthKey?: string) => number
    totalExpense: (monthKey?: string) => number
    monthBalance: (monthKey?: string) => number
    getMonthlyData: () => { month: string; income: number; expense: number; balance: number }[]
}

// Function to determine transaction type based on amount and potentially other factors
function determineTransactionType(transaction: BankAccountTransaction): TransactionType {
    // Simple determination based on amount
    // Positive amount = income, negative amount = expense
    // You might want to enhance this with more sophisticated logic based on transaction.type or description
    if (transaction.amount > 0) {
        return TransactionType.Income
    } else if (transaction.amount < 0) {
        return TransactionType.Expense
    } else {
        return TransactionType.Other
    }
}

// Function to create YearMonth key from a date
function createYearMonthKey(date: Date): string {
    const year = date.getFullYear()
    // Month is 0-based in JS, so add 1 and ensure 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
}

// Create the store
export const useMonthlyAccountViewStore = defineStore<string, MonthlyAccountViewStore>(
    'monthlyAccountView',
    () => {
        const bankAccountStore = useBankAccountsStore()

        // Initialize the monthly view reference
        const monthlyView = ref<MonthlyAccountView>({
            account: undefined,
            months: new Map<string, MonthTransactions>(),
            sortedMonthKeys: [],
            allTransactions: []
        })

        // Set the bank account by ID and organize transactions by month
        function setBankAccountFromId(id: string) {
            const bankAccount = bankAccountStore.getAccountByIdIfExist(id)
            clearMonthlyView()

            if (bankAccount) {
                addBankAccount(bankAccount)
            }
        }

        // Add a bank account and organize its transactions by month
        function addBankAccount(bankAccount: BankAccount) {
            const transactions = [...bankAccount.transactions]
            const monthsMap = new Map<string, MonthTransactions>()
            const monthKeys = new Set<string>()

            // Initialize the monthly view
            monthlyView.value = {
                account: bankAccount,
                months: new Map<string, MonthTransactions>(),
                sortedMonthKeys: [],
                allTransactions: transactions
            }

            // Group transactions by month
            for (const transaction of transactions) {
                const yearMonthKey = createYearMonthKey(transaction.dateInscription)
                const transactionType = determineTransactionType(transaction)

                // Create month entry if it doesn't exist
                if (!monthsMap.has(yearMonthKey)) {
                    monthsMap.set(yearMonthKey, {
                        income: [],
                        expense: [],
                        transfer: [],
                        other: [],
                        all: [],
                        totalIncome: 0,
                        totalExpense: 0,
                        totalTransfer: 0,
                        totalOther: 0,
                        balance: 0
                    })
                    monthKeys.add(yearMonthKey)
                }

                const monthData = monthsMap.get(yearMonthKey)!

                // Add transaction to the appropriate category
                switch (transactionType) {
                    case TransactionType.Income:
                        monthData.income.push(transaction)
                        monthData.totalIncome += transaction.amount
                        break
                    case TransactionType.Expense:
                        monthData.expense.push(transaction)
                        monthData.totalExpense += transaction.amount
                        break
                    case TransactionType.Transfer:
                        monthData.transfer.push(transaction)
                        monthData.totalTransfer += transaction.amount
                        break
                    case TransactionType.Other:
                        monthData.other.push(transaction)
                        monthData.totalOther += transaction.amount
                        break
                }

                // Add to all transactions for this month
                monthData.all.push(transaction)

                // Update month balance
                monthData.balance =
                    monthData.totalIncome +
                    monthData.totalExpense +
                    monthData.totalTransfer +
                    monthData.totalOther
            }

            // Sort month keys chronologically
            const sortedKeys = Array.from(monthKeys).sort()

            // Set the monthly view data
            monthlyView.value.months = monthsMap
            monthlyView.value.sortedMonthKeys = sortedKeys
        }

        // Clear the monthly view
        function clearMonthlyView() {
            monthlyView.value = {
                account: undefined,
                months: new Map<string, MonthTransactions>(),
                sortedMonthKeys: [],
                allTransactions: []
            }
        }

        // Get transactions for a specific month
        function getTransactionsByMonth(yearMonth: string): MonthTransactions | undefined {
            return monthlyView.value.months.get(yearMonth)
        }

        // Compute total income (for a specific month or all if not specified)
        function totalIncome(monthKey?: string): number {
            if (monthKey && monthlyView.value.months.has(monthKey)) {
                return monthlyView.value.months.get(monthKey)!.totalIncome
            }

            // Calculate total for all months if no month key provided
            return Array.from(monthlyView.value.months.values()).reduce(
                (total, month) => total + month.totalIncome,
                0
            )
        }

        // Compute total expense (for a specific month or all if not specified)
        function totalExpense(monthKey?: string): number {
            if (monthKey && monthlyView.value.months.has(monthKey)) {
                return monthlyView.value.months.get(monthKey)!.totalExpense
            }

            // Calculate total for all months if no month key provided
            return Array.from(monthlyView.value.months.values()).reduce(
                (total, month) => total + month.totalExpense,
                0
            )
        }

        // Compute month balance (for a specific month or all if not specified)
        function monthBalance(monthKey?: string): number {
            if (monthKey && monthlyView.value.months.has(monthKey)) {
                return monthlyView.value.months.get(monthKey)!.balance
            }

            // Calculate balance for all months if no month key provided
            return Array.from(monthlyView.value.months.values()).reduce(
                (total, month) => total + month.balance,
                0
            )
        }

        // Get monthly data for charts or reports
        function getMonthlyData() {
            return monthlyView.value.sortedMonthKeys.map((monthKey) => {
                const monthData = monthlyView.value.months.get(monthKey)!
                return {
                    month: monthKey,
                    income: monthData.totalIncome,
                    expense: monthData.totalExpense,
                    balance: monthData.balance
                }
            })
        }

        return {
            monthlyView,
            setBankAccountFromId,
            addBankAccount,
            clearMonthlyView,
            getTransactionsByMonth,
            totalIncome,
            totalExpense,
            monthBalance,
            getMonthlyData
        }
    }
)
