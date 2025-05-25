<template>
    <v-toolbar>
        <div class="dflex w-100 flex-row flex-content justify-space-between">
            <div class="mr-4 ml-4 d-flex flex-row">
                <div class="back-button mr-2">
                    <a @click="goBack" title="Go back">
                        <v-icon size="Large" icon="mdi-chevron-left"></v-icon>
                    </a>
                </div>
                <div class="header-title">
                    <div>account</div>
                </div>
                <div class="d-flex flex-column">
                    <div class="account-name">
                        {{ bankAccount.name }}
                    </div>
                    <div class="account-id">( {{ bankAccount.accountId }} )</div>
                </div>
            </div>
            <div class="mr-4 ml-4">
                <slot />
            </div>
        </div>
    </v-toolbar>
</template>

<style scoped>
    .flex-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .header-title {
        cursor: default;
        height: 100%;
        display: contents;

        > div {
            font-weight: bold;
            align-content: center;
            margin-right: 1em;
        }
    }

    .account-name {
        font-size: medium;
    }

    .account-id {
        font-size: smaller;
    }

    .back-button {
        display: flex;
        align-items: center;
    }

    a {
        cursor: pointer;
    }
</style>

<script setup lang="ts">
    import type { BankAccount } from '@models/BankAccountTypes'
    import { useRouter } from 'vue-router'

    defineProps<{
        bankAccount: BankAccount
    }>()

    const router = useRouter()

    function goBack() {
        router.push({ name: 'accounts' })
    }
</script>
