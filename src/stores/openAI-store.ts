import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { useBankAccountsStore } from './bankAccounts-store'

export type OpenAIMessage = {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export type AccountDataOption = {
    includeTransactions: boolean
    maxTransactions: number
    startDate?: Date
    endDate?: Date
}

export type OpenAIStore = {
    apiKey: Ref<string>
    prompt: Ref<string>
    response: Ref<string>
    loading: Ref<boolean>
    error: Ref<string | null>
    history: Ref<OpenAIMessage[]>
    includeAccountData: Ref<boolean>
    accountDataOptions: Ref<AccountDataOption>
    availableAccounts: ComputedRef<string[]>
    selectedAccounts: Ref<string[]>
    setApiKey: (key: string) => void
    sendPrompt: (prompt: string) => Promise<void>
    clearHistory: () => void
    clearResponse: () => void
    toggleAccountData: () => void
    getFormattedAccountData: () => string
}

export const useOpenAIStore = defineStore<string, OpenAIStore>(
    'openAI',
    () => {
        const bankAccountsStore = useBankAccountsStore()

        const apiKey = ref<string>('')
        const prompt = ref<string>('')
        const response = ref<string>('')
        const loading = ref<boolean>(false)
        const error = ref<string | null>(null)
        const history = ref<OpenAIMessage[]>([])
        const includeAccountData = ref<boolean>(false)
        const selectedAccounts = ref<string[]>([])
        const accountDataOptions = ref<AccountDataOption>({
            includeTransactions: true,
            maxTransactions: 10
        })

        const availableAccounts = computed<string[]>(() => {
            return Object.values(bankAccountsStore.accounts).map((account) => account.accountId)
        })

        function setApiKey(key: string) {
            apiKey.value = key
        }

        function clearHistory() {
            history.value = []
        }

        function clearResponse() {
            response.value = ''
            error.value = null
        }

        function toggleAccountData() {
            includeAccountData.value = !includeAccountData.value
            if (includeAccountData.value && selectedAccounts.value.length === 0) {
                // Auto-select all accounts when enabling account data
                selectedAccounts.value = availableAccounts.value
            }
        }

        function getFormattedAccountData(): string {
            if (!includeAccountData.value || selectedAccounts.value.length === 0) {
                return ''
            }

            let formattedData = '### My Financial Data:\n'

            selectedAccounts.value.forEach((accountId) => {
                const account = bankAccountsStore.getAccountById(accountId)
                if (!account) return

                formattedData += `\n## Account: ${account.name} (${account.accountType || 'Unknown Type'})\n`

                if (accountDataOptions.value.includeTransactions) {
                    let transactions = [...account.transactions]

                    // Filter by date if provided
                    if (accountDataOptions.value.startDate) {
                        transactions = transactions.filter(
                            (t) => t.dateInscription >= accountDataOptions.value.startDate!
                        )
                    }

                    if (accountDataOptions.value.endDate) {
                        transactions = transactions.filter(
                            (t) => t.dateInscription <= accountDataOptions.value.endDate!
                        )
                    }

                    // Sort by date (newest first) and limit
                    transactions = transactions
                        .sort((a, b) => b.dateInscription.getTime() - a.dateInscription.getTime())
                        .slice(0, accountDataOptions.value.maxTransactions)

                    if (transactions.length > 0) {
                        formattedData += '\nRecent transactions:\n'
                        transactions.forEach((t) => {
                            const date = t.dateInscription.toISOString().split('T')[0]
                            formattedData += `- ${date}: ${t.description} (${t.amount.toFixed(2)})\n`
                        })
                    } else {
                        formattedData += '\nNo transactions available.\n'
                    }
                }
            })

            return formattedData
        }

        async function sendPrompt(promptText: string) {
            if (!apiKey.value) {
                error.value = 'Please enter an OpenAI API key'
                return
            }

            loading.value = true
            error.value = null
            prompt.value = promptText

            try {
                // Prepare the complete prompt with account data if enabled
                let completePrompt = promptText
                const accountData = getFormattedAccountData()

                if (accountData) {
                    completePrompt = `${accountData}\n\n${promptText}`
                }

                // Add the user message to history (only show the original prompt to the user)
                history.value.push({
                    role: 'user',
                    content: promptText
                })

                // Create messages array for the API call
                const messages = []

                // If we're including account data, add a system message to help the AI understand the data
                if (accountData) {
                    messages.push({
                        role: 'system',
                        content: `You are a financial assistant integrated into a personal finance management app called Budgan-WUI. 
The user has shared their financial account information with you. Use this data to provide personalized financial advice and insights when relevant to their questions.

When analyzing transactions:
- Positive amounts are deposits/income
- Negative amounts are withdrawals/expenses
- Look for patterns in spending or income
- Identify potential savings opportunities
- Highlight unusual transactions if they appear

Respond in a friendly, helpful manner and provide specific observations based on the user's actual financial data. 
If asked about account balances, calculate them based on the sum of transactions provided.
If the user asks for budgeting advice, make personalized suggestions based on their spending patterns.`
                    })
                }

                // Add all previous conversation messages
                history.value
                    .filter((msg) => msg.role !== 'system')
                    .forEach((msg) => {
                        messages.push({
                            role: msg.role,
                            content: msg.content
                        })
                    })

                // Replace the last user message with our complete prompt that includes account data
                if (accountData && messages.length > 0) {
                    // Find the last user message (without using findLastIndex)
                    let lastIndex = -1
                    for (let i = messages.length - 1; i >= 0; i--) {
                        if (messages[i].role === 'user') {
                            lastIndex = i
                            break
                        }
                    }

                    if (lastIndex >= 0) {
                        messages[lastIndex].content = completePrompt
                    }
                }

                const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey.value}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: messages,
                        temperature: 0.7
                    })
                })

                const data = await apiResponse.json()

                if (!apiResponse.ok) {
                    throw new Error(data.error?.message || 'Failed to communicate with OpenAI')
                }

                const assistantResponse = data.choices[0]?.message?.content || ''
                history.value.push({
                    role: 'assistant',
                    content: assistantResponse
                })

                // Store the response in our state
                response.value = assistantResponse
            } catch (err: any) {
                console.error('Error communicating with OpenAI:', err)
                error.value = err.message || 'An error occurred while communicating with OpenAI'
            } finally {
                loading.value = false
            }
        }

        return {
            apiKey,
            prompt,
            response,
            loading,
            error,
            history,
            includeAccountData,
            accountDataOptions,
            availableAccounts,
            selectedAccounts,
            setApiKey,
            sendPrompt,
            clearHistory,
            clearResponse,
            toggleAccountData,
            getFormattedAccountData
        }
    },
    {
        persist: {
            storage: localStorage,
            paths: [
                'apiKey',
                'history',
                'includeAccountData',
                'selectedAccounts',
                'accountDataOptions'
            ]
        }
    }
)
