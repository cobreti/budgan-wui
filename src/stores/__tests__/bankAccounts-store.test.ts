import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBankAccountsStore } from '../bankAccounts-store'
import type { BankAccount, BankAccountTransaction } from '@/core/models/BankAccountTypes'

describe('BankAccountsStore', () => {
  let store: ReturnType<typeof useBankAccountsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useBankAccountsStore()
  })

  describe('addWithBankAccount', () => {
    it('should sort transactions by date in ascending order for new accounts', () => {
      // Create an account with unsorted transactions
      const unsortedTransactions: BankAccountTransaction[] = [
        {
          transactionId: 'trans3',
          transactionGroupId: 'group1',
          dateInscription: new Date('2023-03-15'),
          amount: 150,
          type: 'DEPOSIT',
          description: 'Latest deposit'
        },
        {
          transactionId: 'trans1',
          transactionGroupId: 'group1',
          dateInscription: new Date('2023-01-10'),
          amount: 100,
          type: 'DEPOSIT',
          description: 'First deposit'
        },
        {
          transactionId: 'trans2',
          transactionGroupId: 'group1',
          dateInscription: new Date('2023-02-05'),
          amount: -50,
          type: 'WITHDRAWAL',
          description: 'Middle withdrawal'
        }
      ]

      const newAccount: BankAccount = {
        name: 'Test Account',
        accountId: 'test-123',
        accountType: 'checking',
        transactions: [...unsortedTransactions],
        transactionsGroups: [
          {
            name: 'Group 1',
            id: 'group1',
            dateStart: new Date('2023-01-01'),
            dateEnd: new Date('2023-03-31')
          }
        ]
      }

      // Add the account to the store
      store.addWithBankAccount(newAccount)

      // Get the account from the store
      const storedAccount = store.getAccountById('test-123')

      // Verify transactions are sorted by date
      expect(storedAccount.transactions.length).toBe(3)
      
      // First transaction should be the earliest date
      expect(storedAccount.transactions[0].transactionId).toBe('trans1')
      expect(storedAccount.transactions[0].dateInscription.toISOString()).toBe(new Date('2023-01-10').toISOString())
      
      // Second transaction should be the middle date
      expect(storedAccount.transactions[1].transactionId).toBe('trans2')
      expect(storedAccount.transactions[1].dateInscription.toISOString()).toBe(new Date('2023-02-05').toISOString())
      
      // Third transaction should be the latest date
      expect(storedAccount.transactions[2].transactionId).toBe('trans3')
      expect(storedAccount.transactions[2].dateInscription.toISOString()).toBe(new Date('2023-03-15').toISOString())
    })

    it('should sort transactions when adding new transactions to an existing account', () => {
      // Create initial account with sorted transactions
      const initialTransactions: BankAccountTransaction[] = [
        {
          transactionId: 'trans1',
          transactionGroupId: 'group1',
          dateInscription: new Date('2023-01-10'),
          amount: 100,
          type: 'DEPOSIT',
          description: 'First deposit'
        },
        {
          transactionId: 'trans2',
          transactionGroupId: 'group1',
          dateInscription: new Date('2023-02-05'),
          amount: -50,
          type: 'WITHDRAWAL',
          description: 'First withdrawal'
        }
      ]

      const initialAccount: BankAccount = {
        name: 'Test Account',
        accountId: 'test-123',
        accountType: 'checking',
        transactions: [...initialTransactions],
        transactionsGroups: [
          {
            name: 'Group 1',
            id: 'group1',
            dateStart: new Date('2023-01-01'),
            dateEnd: new Date('2023-02-28')
          }
        ]
      }

      // Add initial account to the store
      store.addWithBankAccount(initialAccount)

      // Create additional transactions with mixed dates
      const newTransactions: BankAccountTransaction[] = [
        {
          transactionId: 'trans4',
          transactionGroupId: 'group2',
          dateInscription: new Date('2023-01-25'), // Between trans1 and trans2
          amount: 75,
          type: 'DEPOSIT', 
          description: 'Mid deposit'
        },
        {
          transactionId: 'trans3',
          transactionGroupId: 'group2',
          dateInscription: new Date('2022-12-15'), // Before trans1
          amount: 50,
          type: 'DEPOSIT',
          description: 'Earlier deposit'
        },
        {
          transactionId: 'trans5',
          transactionGroupId: 'group2',
          dateInscription: new Date('2023-03-10'), // After trans2
          amount: -25,
          type: 'WITHDRAWAL',
          description: 'Latest withdrawal'
        }
      ]

      // Create account update with new transactions
      const accountUpdate: BankAccount = {
        name: 'Test Account',
        accountId: 'test-123',
        accountType: 'checking',
        transactions: [...newTransactions],
        transactionsGroups: [
          {
            name: 'Group 2',
            id: 'group2',
            dateStart: new Date('2022-12-01'),
            dateEnd: new Date('2023-03-31')
          }
        ]
      }

      // Add the account update to the store
      store.addWithBankAccount(accountUpdate)

      // Get the updated account from the store
      const storedAccount = store.getAccountById('test-123')

      // Verify merged transactions are sorted by date
      expect(storedAccount.transactions.length).toBe(5)
      
      // Check the order of transactions by date
      expect(storedAccount.transactions[0].transactionId).toBe('trans3') // 2022-12-15
      expect(storedAccount.transactions[1].transactionId).toBe('trans1') // 2023-01-10
      expect(storedAccount.transactions[2].transactionId).toBe('trans4') // 2023-01-25
      expect(storedAccount.transactions[3].transactionId).toBe('trans2') // 2023-02-05
      expect(storedAccount.transactions[4].transactionId).toBe('trans5') // 2023-03-10
      
      // Verify the dates are in order
      const dates = storedAccount.transactions.map(t => t.dateInscription.getTime())
      
      // Check if dates are in ascending order
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeGreaterThanOrEqual(dates[i-1])
      }
    })

    it('should not add duplicate transactions when adding to an existing account', () => {
      // Create initial account with transactions
      const initialTransactions: BankAccountTransaction[] = [
        {
          transactionId: 'trans1',
          transactionGroupId: 'group1',
          dateInscription: new Date('2023-01-10'),
          amount: 100,
          type: 'DEPOSIT',
          description: 'First deposit'
        },
        {
          transactionId: 'trans2',
          transactionGroupId: 'group1',
          dateInscription: new Date('2023-02-05'),
          amount: -50,
          type: 'WITHDRAWAL',
          description: 'First withdrawal'
        }
      ]

      const initialAccount: BankAccount = {
        name: 'Test Account',
        accountId: 'test-123',
        accountType: 'checking',
        transactions: [...initialTransactions],
        transactionsGroups: [
          {
            name: 'Group 1',
            id: 'group1',
            dateStart: new Date('2023-01-01'),
            dateEnd: new Date('2023-02-28')
          }
        ]
      }

      // Add initial account to the store
      store.addWithBankAccount(initialAccount)

      // Create update with both new and duplicate transactions
      const updateTransactions: BankAccountTransaction[] = [
        {
          transactionId: 'trans1', // Duplicate
          transactionGroupId: 'group2',
          dateInscription: new Date('2023-01-10'),
          amount: 100,
          type: 'DEPOSIT',
          description: 'Duplicate deposit'
        },
        {
          transactionId: 'trans3', // New
          transactionGroupId: 'group2',
          dateInscription: new Date('2023-03-15'),
          amount: 200,
          type: 'DEPOSIT',
          description: 'New deposit'
        }
      ]

      const accountUpdate: BankAccount = {
        name: 'Test Account',
        accountId: 'test-123',
        accountType: 'checking',
        transactions: [...updateTransactions],
        transactionsGroups: [
          {
            name: 'Group 2',
            id: 'group2',
            dateStart: new Date('2023-03-01'),
            dateEnd: new Date('2023-03-31')
          }
        ]
      }

      // Add the account update to the store
      store.addWithBankAccount(accountUpdate)

      // Get the updated account from the store
      const storedAccount = store.getAccountById('test-123')

      // Verify only unique transactions are added (3 total: 2 initial + 1 new)
      expect(storedAccount.transactions.length).toBe(3)
      
      // Check for the specific transaction IDs
      const transactionIds = storedAccount.transactions.map(t => t.transactionId)
      expect(transactionIds).toContain('trans1')
      expect(transactionIds).toContain('trans2')
      expect(transactionIds).toContain('trans3')

      // Check that trans1 appears only once
      expect(transactionIds.filter(id => id === 'trans1').length).toBe(1)
    })
  })
})