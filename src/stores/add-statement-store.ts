import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { BankAccount } from '@models/BankAccountTypes'

export type Statement = {
    account: BankAccount
    filename: string
    startDate: Date
    endDate: Date
    numberOfTransactions: number
}

export type StatementsDictionary = { [key: string]: Statement }

export type AddStatementStore = {
    loading: Ref<boolean>
    statements: Ref<StatementsDictionary>
    clear: () => void
    setLoadingFile: (filename: string) => void
    clearLoadingFileStatus: () => void
    setStatement: (statement: Statement) => void
    removeStatement: (id: string) => void
    statementExists: (id: string) => boolean
    getStatementById: (id: string) => Statement | undefined
    getAllStatements: () => Statement[]
}

export const useAddStatementStore = defineStore<string, AddStatementStore>('addStatement', () => {
    const statements = ref<StatementsDictionary>({})

    const loading = ref<boolean>(false)

    function clear() {
        loading.value = false
        statements.value = {}
    }

    function setLoadingFile(filename: string) {
        loading.value = true
    }

    function clearLoadingFileStatus() {
        loading.value = false
    }

    function setStatement(statement: Statement) {
        // Create a more unique ID that includes timestamp to avoid conflicts
        const timestamp = Date.now()
        const statementId = `${statement.account.accountId}_${statement.filename}_${timestamp}`
        statements.value[statementId] = statement
    }

    function removeStatement(id: string) {
        if (id in statements.value) {
            delete statements.value[id]
        }
    }

    function getAllStatements(): Statement[] {
        return Object.values(statements.value)
    }

    function statementExists(id: string): boolean {
        return id in statements.value
    }

    function getStatementById(id: string): Statement | undefined {
        return statements.value[id]
    }

    return {
        loading,
        statements,
        clear,
        setLoadingFile,
        clearLoadingFileStatus,
        setStatement,
        removeStatement,
        statementExists,
        getStatementById,
        getAllStatements
    }
})
