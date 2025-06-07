import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type OpenAIMessage = {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export type OpenAIStore = {
    apiKey: Ref<string>
    prompt: Ref<string>
    response: Ref<string>
    loading: Ref<boolean>
    error: Ref<string | null>
    history: Ref<OpenAIMessage[]>
    setApiKey: (key: string) => void
    sendPrompt: (prompt: string) => Promise<void>
    clearHistory: () => void
    clearResponse: () => void
}

export const useOpenAIStore = defineStore<string, OpenAIStore>(
    'openAI',
    () => {
        const apiKey = ref<string>('')
        const prompt = ref<string>('')
        const response = ref<string>('')
        const loading = ref<boolean>(false)
        const error = ref<string | null>(null)
        const history = ref<OpenAIMessage[]>([])

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

        async function sendPrompt(promptText: string) {
            if (!apiKey.value) {
                error.value = 'Please enter an OpenAI API key'
                return
            }

            loading.value = true
            error.value = null
            prompt.value = promptText

            try {
                // Add the user message to history
                history.value.push({
                    role: 'user',
                    content: promptText
                })

                const messages = history.value.map((msg) => ({
                    role: msg.role,
                    content: msg.content
                }))

                const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error?.message || 'Failed to communicate with OpenAI')
                }

                const assistantResponse = data.choices[0]?.message?.content || ''
                history.value.push({
                    role: 'assistant',
                    content: assistantResponse
                })

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
            setApiKey,
            sendPrompt,
            clearHistory,
            clearResponse
        }
    },
    {
        persist: {
            storage: localStorage,
            paths: ['apiKey', 'history']
        }
    }
)
