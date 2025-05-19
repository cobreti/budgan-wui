import type { BankAccountTransactionsGroup } from '@models/BankAccountTypes'

//
// test 1 : add new transactions group with no duplicated transactions
//

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
// test 3 : add new transactions group that has the same id as an existing group
//

export const transactionsGroups_test3_existing_transactions: BankAccountTransactionsGroup[] = [
    {
        name: 'Group 1',
        id: '1',
        dateStart: new Date('2022-01-01'),
        dateEnd: new Date('2022-01-31'),
        invalidTransactions: []
    }
]
