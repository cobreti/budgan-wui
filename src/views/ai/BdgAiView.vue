<template>
    <div class="ai-page">
        <v-container class="ai-container">
            <v-row>
                <v-col cols="12">
                    <h1 class="text-h4 mb-6">AI Assistant</h1>
                    <v-card class="mb-6">
                        <v-card-title>OpenAI API Settings</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" sm="4">
                                    <v-select
                                        v-model="selectedModel"
                                        :items="openAIStore.availableModels"
                                        item-title="name"
                                        item-value="id"
                                        label="AI Model"
                                        return-object
                                        @update:model-value="updateModel"
                                    ></v-select>
                                </v-col>
                                <v-col cols="12" sm="8">
                                    <v-text-field
                                        v-model="apiKey"
                                        label="OpenAI API Key"
                                        placeholder="Enter your OpenAI API key"
                                        type="password"
                                        hint="Your API key isn't stored anywhere."
                                        persistent-hint
                                        @update:model-value="saveApiKey"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <p class="text-caption mt-2">
                                Don't have an API key?
                                <a
                                    href="https://platform.openai.com/account/api-keys"
                                    target="_blank"
                                    >Get one from OpenAI</a
                                >
                            </p>
                        </v-card-text>
                    </v-card>
                    <v-card class="mb-6">
                        <v-card-title>Financial Data Integration</v-card-title>
                        <v-card-text>
                            <v-switch
                                v-model="includeAccountData"
                                color="primary"
                                label="Include my financial data in AI prompts"
                                :disabled="!hasAccounts"
                                @change="openAIStore.toggleAccountData"
                            ></v-switch>
                            <div v-if="openAIStore.includeAccountData" class="account-data-options">
                                <v-alert
                                    v-if="!hasAccounts"
                                    type="info"
                                    text="You don't have any accounts yet. Add accounts to use the AI with your financial data."
                                    class="mb-4"
                                ></v-alert>
                                <template v-else>
                                    <v-select
                                        v-model="openAIStore.selectedAccounts"
                                        :items="accountOptions"
                                        item-title="name"
                                        item-value="id"
                                        label="Select accounts to include"
                                        multiple
                                        chips
                                        class="mb-4"
                                    ></v-select>
                                    <v-switch
                                        v-model="openAIStore.accountDataOptions.includeTransactions"
                                        color="primary"
                                        label="Include transaction history"
                                        class="mb-2"
                                    ></v-switch>
                                    <v-expand-transition>
                                        <div
                                            v-if="
                                                openAIStore.accountDataOptions.includeTransactions
                                            "
                                        >
                                            <v-slider
                                                v-model="
                                                    openAIStore.accountDataOptions.maxTransactions
                                                "
                                                color="primary"
                                                label="Max transactions to include"
                                                min="5"
                                                max="50"
                                                step="5"
                                                thumb-label
                                                class="mb-4"
                                            ></v-slider>
                                            <v-row>
                                                <v-col cols="12" sm="6">
                                                    <v-menu
                                                        v-model="startDateMenu"
                                                        :close-on-content-click="false"
                                                    >
                                                        <template v-slot:activator="{ props }">
                                                            <v-text-field
                                                                v-bind="props"
                                                                v-model="startDateFormatted"
                                                                label="Start Date (optional)"
                                                                prepend-icon="mdi-calendar"
                                                                readonly
                                                                clearable
                                                                @click:clear="clearStartDate"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="startDate"
                                                            @update:model-value="
                                                                startDateMenu = false
                                                            "
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col cols="12" sm="6">
                                                    <v-menu
                                                        v-model="endDateMenu"
                                                        :close-on-content-click="false"
                                                    >
                                                        <template v-slot:activator="{ props }">
                                                            <v-text-field
                                                                v-bind="props"
                                                                v-model="endDateFormatted"
                                                                label="End Date (optional)"
                                                                prepend-icon="mdi-calendar"
                                                                readonly
                                                                clearable
                                                                @click:clear="clearEndDate"
                                                            ></v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="endDate"
                                                            @update:model-value="
                                                                endDateMenu = false
                                                            "
                                                        ></v-date-picker>
                                                    </v-menu>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-transition>
                                    <div class="mt-4">
                                        <v-alert
                                            type="info"
                                            class="mb-4"
                                            text="Your financial data will be sent to OpenAI along with your prompts to provide personalized insights. Data is sent only when you send a message."
                                        ></v-alert>
                                        <v-btn
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            @click="showAccountPreview = !showAccountPreview"
                                            class="mt-2"
                                        >
                                            {{ showAccountPreview ? 'Hide' : 'Show' }} Data Preview
                                        </v-btn>
                                        <v-expand-transition>
                                            <div v-if="showAccountPreview" class="mt-4">
                                                <v-card>
                                                    <v-card-title class="text-subtitle-1">
                                                        Data that will be shared with OpenAI
                                                    </v-card-title>
                                                    <v-card-text>
                                                        <pre class="data-preview">{{
                                                            openAIStore.getFormattedAccountData()
                                                        }}</pre>
                                                    </v-card-text>
                                                </v-card>
                                            </div>
                                        </v-expand-transition>
                                    </div>
                                </template>
                            </div>
                        </v-card-text>
                    </v-card>
                    <v-card class="mb-6">
                        <v-card-title>Chat with AI</v-card-title>
                        <v-card-text>
                            <div class="chat-history mb-4" ref="chatHistoryRef">
                                <div v-if="openAIStore.history.length === 0">
                                    <div class="text-center pa-4">
                                        <v-icon size="large" icon="mdi-robot-outline"></v-icon>
                                        <p class="mt-2">No messages yet. Start a conversation!</p>
                                        <p
                                            v-if="openAIStore.includeAccountData && hasAccounts"
                                            class="text-caption"
                                        >
                                            Try asking about your spending patterns or account
                                            balances.
                                        </p>
                                    </div>
                                </div>
                                <div
                                    v-for="(message, index) in openAIStore.history"
                                    :key="index"
                                    class="mb-3"
                                >
                                    <v-card
                                        :color="message.role === 'user' ? 'primary' : 'surface'"
                                        :class="
                                            message.role === 'user' ? 'user-message' : 'ai-message'
                                        "
                                    >
                                        <v-card-text>
                                            <div class="message-header mb-1 d-flex align-center">
                                                <strong>{{
                                                    message.role === 'user' ? 'You' : 'AI Assistant'
                                                }}</strong>
                                                <v-chip
                                                    v-if="
                                                        message.role === 'assistant' &&
                                                        message.model
                                                    "
                                                    size="x-small"
                                                    class="ml-2"
                                                    color="primary"
                                                    variant="outlined"
                                                >
                                                    {{ getModelName(message.model) }}
                                                </v-chip>
                                            </div>
                                            <div
                                                class="message-content"
                                                style="white-space: pre-wrap"
                                            >
                                                {{ message.content }}
                                            </div>
                                        </v-card-text>
                                    </v-card>
                                </div>
                                <div v-if="openAIStore.loading" class="text-center pa-4">
                                    <v-progress-circular
                                        indeterminate
                                        color="primary"
                                    ></v-progress-circular>
                                    <p class="mt-2">AI is thinking...</p>
                                </div>
                                <div v-if="openAIStore.error" class="text-center pa-4">
                                    <v-alert
                                        type="error"
                                        title="Error"
                                        :text="openAIStore.error"
                                    ></v-alert>
                                </div>
                            </div>
                            <div class="prompt-input">
                                <v-textarea
                                    v-model="prompt"
                                    label="Enter your prompt"
                                    placeholder="Type your message here..."
                                    auto-grow
                                    rows="3"
                                    :disabled="openAIStore.loading"
                                    @keydown.enter.ctrl.prevent="sendPrompt"
                                ></v-textarea>
                                <div class="d-flex justify-space-between align-center mt-2">
                                    <div class="text-caption">Press Ctrl+Enter to send</div>
                                    <div>
                                        <v-btn
                                            color="error"
                                            variant="text"
                                            :disabled="
                                                openAIStore.history.length === 0 ||
                                                openAIStore.loading
                                            "
                                            @click="clearHistory"
                                        >
                                            Clear History
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            :disabled="
                                                !prompt.trim() || openAIStore.loading || !apiKey
                                            "
                                            @click="sendPrompt"
                                            :loading="openAIStore.loading"
                                        >
                                            Send
                                        </v-btn>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style scoped>
    .ai-page {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 64px); /* Subtract app bar height */
    }
    .ai-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
        flex: 1;
    }
    .chat-history {
        max-height: 500px;
        overflow-y: auto;
        padding: 1rem 0;
        border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
        border-radius: 8px;
        background-color: rgba(var(--v-theme-surface-variant), 0.1);
    }
    .user-message {
        margin-left: 2rem;
        margin-right: 0.5rem;
    }
    .ai-message {
        margin-right: 2rem;
        margin-left: 0.5rem;
    }
    .message-header {
        opacity: 0.8;
    }
    .account-data-options {
        padding-top: 1rem;
        margin-left: 2.5rem;
    }
    .data-preview {
        font-family: monospace;
        font-size: 0.85rem;
        white-space: pre-wrap;
        background-color: rgba(var(--v-theme-surface-variant), 0.3);
        padding: 1rem;
        border-radius: 4px;
        max-height: 300px;
        overflow-y: auto;
    }
</style>
<script setup lang="ts">
    import { ref, computed, watch, onMounted, nextTick } from 'vue'
    import { useOpenAIStore } from '@/stores/openAI-store'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'

    const openAIStore = useOpenAIStore()
    const bankAccountsStore = useBankAccountsStore()

    const includeAccountData = computed(() => openAIStore.includeAccountData)
    const apiKey = ref(openAIStore.apiKey)
    const prompt = ref('')
    const chatHistoryRef = ref<HTMLElement | null>(null)
    const startDateMenu = ref(false)
    const endDateMenu = ref(false)
    const startDate = ref<string | null>(null)
    const endDate = ref<string | null>(null)
    const showAccountPreview = ref(false)
    const selectedModel = ref(
        openAIStore.availableModels.find((model) => model.id === openAIStore.selectedModel) ||
            openAIStore.availableModels[0]
    )

    const hasAccounts = computed(() => {
        return bankAccountsStore.hasAccounts
    })

    const accountOptions = computed(() => {
        return Object.values(bankAccountsStore.accounts).map((account) => ({
            id: account.accountId,
            name: `${account.name} (${account.accountType || 'Unknown'})`
        }))
    })

    const startDateFormatted = computed(() => {
        return startDate.value ? formatDate(startDate.value) : ''
    })

    const endDateFormatted = computed(() => {
        return endDate.value ? formatDate(endDate.value) : ''
    })

    // Watch for date changes and update the store options
    watch(startDate, (newDate) => {
        if (newDate) {
            openAIStore.accountDataOptions.startDate = new Date(newDate)
        } else {
            openAIStore.accountDataOptions.startDate = undefined
        }
    })

    watch(endDate, (newDate) => {
        if (newDate) {
            openAIStore.accountDataOptions.endDate = new Date(newDate)
        } else {
            openAIStore.accountDataOptions.endDate = undefined
        }
    })

    function formatDate(dateString: string): string {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

    function clearStartDate() {
        startDate.value = null
        openAIStore.accountDataOptions.startDate = undefined
    }

    function clearEndDate() {
        endDate.value = null
        openAIStore.accountDataOptions.endDate = undefined
    }

    function saveApiKey() {
        openAIStore.setApiKey(apiKey.value)
    }

    function updateModel() {
        if (selectedModel.value) {
            openAIStore.setModel(selectedModel.value.id)
        }
    }

    const getModelName = (modelId: string): string => {
        const model = openAIStore.availableModels.find((model) => model.id === modelId)
        return model ? model.name : modelId
    }

    async function sendPrompt() {
        if (!prompt.value.trim() || !apiKey.value) return

        await openAIStore.sendPrompt(prompt.value)
        prompt.value = ''
    }

    function clearHistory() {
        openAIStore.clearHistory()
    }

    // Scroll to bottom of chat history when new messages are added
    watch(
        () => openAIStore.history.length,
        async () => {
            await nextTick()
            if (chatHistoryRef.value) {
                chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
            }
        }
    )

    // Scroll to bottom when component is mounted
    onMounted(async () => {
        await nextTick()
        if (chatHistoryRef.value) {
            chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
        }

        // Initialize date values from store if they exist
        if (openAIStore.accountDataOptions.startDate) {
            const date = openAIStore.accountDataOptions.startDate
            startDate.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        }

        if (openAIStore.accountDataOptions.endDate) {
            const date = openAIStore.accountDataOptions.endDate
            endDate.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        }
    })
</script>
