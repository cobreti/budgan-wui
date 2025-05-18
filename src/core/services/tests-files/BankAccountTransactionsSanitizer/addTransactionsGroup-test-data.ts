import type { BankAccountTransaction, BankAccountTransactionsGroup } from '@models/BankAccountTypes'
import { InvalidTransactionReason } from '@models/BankAccountTypes'

//
// test 1 : add new transactions group with no duplicated transactions
//

// Transactions moved to BankAccount.transactions
export const test1_transactions: BankAccountTransaction[] = [
    {
        transactionId: '10',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-01'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 1'
    },
    {
        transactionId: '11',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-02'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 2'
    }
]

export const transactionsGroup_test1_success_input: BankAccountTransactionsGroup = {
    name: 'Group 1',
    id: '1',
    dateStart: new Date('2022-01-01'),
    dateEnd: new Date('2022-01-31')
}

export const transactionsGroup_test1_expected_transactionsIds = {
    '10': {},
    '11': {}
}

export const transactionsGroups_test1_expected: BankAccountTransactionsGroup[] = [
    {
        name: 'Group 1',
        id: '1',
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-31'),
        invalidTransactions: []
    }
]

//
//  test 2 : add new transactions group with some duplicated transactions
//

// Transactions for Group 1 moved to BankAccount.transactions
export const test2_group1_transactions: BankAccountTransaction[] = [
    {
        transactionId: '10',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-01'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 1'
    },
    {
        transactionId: '11',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-02'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 2'
    }
]

export const transactionsGroups_test2_existing_transactions: BankAccountTransactionsGroup[] = [
    {
        name: 'Group 1',
        id: '1',
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-31'),
        invalidTransactions: []
    }
]

export const transactionsGroup_test2_existing_transactionsIds = {
    '10': {},
    '11': {}
}

// Transactions for Group 2 moved to BankAccount.transactions
export const test2_group2_transactions: BankAccountTransaction[] = [
    {
        transactionId: '10',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-01'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 1'
    },
    {
        transactionId: '11',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-02'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 2'
    },
    {
        transactionId: '12',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-03'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 3'
    },
    {
        transactionId: '13',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-04'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 4'
    },
    {
        transactionId: '14',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-05'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 5'
    }
]

export const transactionsGroup_test2_input: BankAccountTransactionsGroup = {
    name: 'Group 2',
    id: '2',
    dateStart: new Date('2022-01-01'),
    dateEnd: new Date('2022-01-31'),
    invalidTransactions: []
}

export const transactionsGroup_test2_expected: BankAccountTransactionsGroup[] = [
    {
        name: 'Group 1',
        id: '1',
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-31'),
        invalidTransactions: []
    },
    {
        name: 'Group 2',
        id: '2',
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-31'),
        invalidTransactions: [
            {
                transactionId: '10',
                transactionGroupId: '2',
                dateInscription: new Date('2022-01-01'),
                amount: 100,
                type: 'Deposit',
                description: 'Deposit 1',
                invalidReason: InvalidTransactionReason.duplicate
            },
            {
                transactionId: '11',
                transactionGroupId: '2',
                dateInscription: new Date('2022-01-02'),
                amount: 100,
                type: 'Deposit',
                description: 'Deposit 2',
                invalidReason: InvalidTransactionReason.duplicate
            }
        ]
    }
]

// Valid transactions for Group 2 that would be in BankAccount.transactions
export const test2_expected_valid_transactions: BankAccountTransaction[] = [
    {
        transactionId: '12',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-03'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 3'
    },
    {
        transactionId: '13',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-04'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 4'
    },
    {
        transactionId: '14',
        transactionGroupId: '2',
        dateInscription: new Date('2022-01-05'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 5'
    }
]

export const transactionsGroup_test2_resulting_transactionIds = {
    '10': {},
    '11': {},
    '12': {},
    '13': {},
    '14': {}
}

//
// test 3 : add new transactions group that has the same id as an existing group
//

// Transactions for existing Group 1 moved to BankAccount.transactions
export const test3_existing_group1_transactions: BankAccountTransaction[] = [
    {
        transactionId: '10',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-01'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 1'
    },
    {
        transactionId: '11',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-02'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 2'
    }
]

export const transactionsGroups_test3_existing_transactions: BankAccountTransactionsGroup[] = [
    {
        name: 'Group 1',
        id: '1',
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-31'),
        invalidTransactions: []
    }
]

// New transactions for the new Group 1 (same ID)
export const test3_new_group1_transactions: BankAccountTransaction[] = [
    {
        transactionId: '12',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-01'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 1'
    },
    {
        transactionId: '15',
        transactionGroupId: '1',
        dateInscription: new Date('2022-01-02'),
        amount: 100,
        type: 'Deposit',
        description: 'Deposit 2'
    }
]

export const transactionsGroups_test3_input: BankAccountTransactionsGroup = {
    name: 'Group 1',
    id: '1',
    dateStart: new Date('2022-01-01'),
    dateEnd: new Date('2022-01-31'),
    invalidTransactions: []
}
