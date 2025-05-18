import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import '@/core/setupInversify'
import { BankAccountOperations } from './BankAccountOperations'
import type { BankAccount } from '@models/BankAccountTypes'
import {
    data_getCombinedTransactionsGroup_Different_account_ids,
    data_getCombinedTransactionsGroup_Success_expected,
    data_getCombinedTransactionsGroup_Success_input
} from '@services/tests-files/BankAccountOperations/getCombineTransactionsGroup-test-data'
import {
    data_sortTransactionsGroupByStartDateAscending_ordered_result,
    data_sortTransactionsGroupByStartDateAscending_unordered_input
} from '@services/tests-files/BankAccountOperations/sortTransactionsGroupByStartDateAscending-test-data'

describe('BankAccountOperations', () => {
    let bankAccountOperationService = new BankAccountOperations()

    beforeEach(async () => {
        bankAccountOperationService = new BankAccountOperations()
    })

    afterEach(async () => {
        vi.resetAllMocks()
    })

    describe('getTransactionsInBothAccounts', () => {
        test('getTransactionsInBothAccounts success', () => {
            const startDate = new Date()
            const endDate = new Date(startDate.getDate() + 1)
            const dateInscription = new Date()

            const account1: BankAccount = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const account2: BankAccount = {
                accountId: '1',
                name: 'Account 2',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '4',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const result = bankAccountOperationService.getTransactionsInBothAccounts(
                account1,
                account2
            )

            expect(result).toEqual(new Set(['1', '3']))
        })

        test('getTransactionsInBothAccounts in multiple transactions groups success', () => {
            const startDate = new Date()
            const endDate = new Date(startDate.getDate() + 1)
            const dateInscription = new Date()

            const account1: BankAccount = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '4',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '5',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '6',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    },
                    {
                        name: 'Group 2',
                        id: '2',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const account2: BankAccount = {
                accountId: '1',
                name: 'Account 2',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '8',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '4',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '7',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '9',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    },
                    {
                        name: 'Group 2',
                        id: '2',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const result = bankAccountOperationService.getTransactionsInBothAccounts(
                account1,
                account2
            )

            expect(result).toEqual(new Set(['1', '3', '4']))
        })

        test('account id does not match', () => {
            const startDate = new Date()
            const endDate = new Date(startDate.getDate() + 1)
            const dateInscription = new Date()

            const account1: BankAccount = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const account2: BankAccount = {
                accountId: '2',
                name: 'Account 2',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '4',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            expect(() =>
                bankAccountOperationService.getTransactionsInBothAccounts(account1, account2)
            ).toThrowError('Account Ids do not match')
        })
    })

    describe('removeTransactionsFromBankAccount', () => {
        test('removeTransactionsFromBankAccount success', () => {
            const startDate = new Date()
            const endDate = new Date(startDate.getDate() + 1)
            const dateInscription = new Date()

            const account: BankAccount = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const transactionsToRemove = new Set(['1', '3'])

            bankAccountOperationService.removeTransactionsFromBankAccount(
                account,
                transactionsToRemove
            )

            expect(account).toEqual({
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            })
        })

        test('removeTransactionsFromBankAccount success with multiple groups', () => {
            const startDate = new Date()
            const endDate = new Date(startDate.getDate() + 1)
            const dateInscription = new Date()

            const account: BankAccount = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '4',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '5',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '6',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    },
                    {
                        name: 'Group 2',
                        id: '2',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const transactionsToRemove = new Set(['1', '3', '5'])

            const expectedResult = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '4',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '6',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    },
                    {
                        name: 'Group 2',
                        id: '2',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            bankAccountOperationService.removeTransactionsFromBankAccount(
                account,
                transactionsToRemove
            )

            expect(account).toEqual(expectedResult)
        })

        test('removeTransactionsFromBankAccount success with multiple groups and empty groups in the result', () => {
            const startDate = new Date()
            const endDate = new Date(startDate.getDate() + 1)
            const dateInscription = new Date()

            const account: BankAccount = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '1',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '2',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '3',
                        transactionGroupId: '1',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '4',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '5',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    },
                    {
                        transactionId: '6',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 1',
                        id: '1',
                        dateStart: startDate,
                        dateEnd: endDate
                    },
                    {
                        name: 'Group 2',
                        id: '2',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            const transactionsToRemove = new Set(['1', '2', '3', '5', '6'])

            const expectedResult = {
                accountId: '1',
                name: 'Account 1',
                accountType: 'Checking',
                transactions: [
                    {
                        transactionId: '4',
                        transactionGroupId: '2',
                        dateInscription: dateInscription,
                        amount: 100,
                        type: 'Deposit',
                        description: 'Deposit'
                    }
                ],
                transactionsGroups: [
                    {
                        name: 'Group 2',
                        id: '2',
                        dateStart: startDate,
                        dateEnd: endDate
                    }
                ]
            }

            bankAccountOperationService.removeTransactionsFromBankAccount(
                account,
                transactionsToRemove
            )

            expect(account).toEqual(expectedResult)
        })
    })

    describe('getCombinedTransactionsGroup', () => {
        test('getCombinedTransactionsGroup success', () => {
            const result = bankAccountOperationService.getCombinedTransactionsGroup(
                ...data_getCombinedTransactionsGroup_Success_input
            )

            expect(result).toEqual(data_getCombinedTransactionsGroup_Success_expected)

            console.log(result)
        })

        test('getcombinedTransactionsGroup empty accounts', () => {
            const result = bankAccountOperationService.getCombinedTransactionsGroup()
            expect(result).toEqual([])
        })

        test('getCombinedTransactionsGroup different account ids', () => {
            expect(() =>
                bankAccountOperationService.getCombinedTransactionsGroup(
                    ...data_getCombinedTransactionsGroup_Different_account_ids
                )
            ).toThrowError('cannot combine transactions group from different accounts')
        })
    })

    describe('sortTransactionsGroupByStartDateAscending', () => {
        test('sortTransactionsGroupByStartDateAscending success', () => {
            const result = bankAccountOperationService.sortTransactionsGroupByStartDateAscending(
                data_sortTransactionsGroupByStartDateAscending_unordered_input
            )
            expect(result).toEqual(data_sortTransactionsGroupByStartDateAscending_ordered_result)
        })
    })
})
