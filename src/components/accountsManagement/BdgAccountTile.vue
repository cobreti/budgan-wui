<template>
    <v-card class="ma-10">
        <v-card-title class="cursor-pointer">
            <v-btn
                class="account-name"
                variant="plain"
                :to="{ path: '/account/' + props.account.accountId + '/transactions' }"
            >
                {{ props.account.name }}
            </v-btn>
        </v-card-title>
        <v-card-text class="cursor-default ml-6">
            <div class="d-flex flex-row">
                <div class="info-span">
                    {{ props.account.accountId }}
                </div>
                <div class="info-span">{{ props.account.accountType }}</div>
                <v-btn class="ml-auto" color="red" @click="deleteAccount(props.account.accountId)">
                    Delete
                </v-btn>
            </div>
        </v-card-text>
    </v-card>
</template>

<style scoped>
    .account-name {
        font-size: 1em;
        font-weight: bold;
    }

    .cursor-default {
        cursor: default;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .info-span {
        margin-right: 1em;
        width: 20em;
    }
</style>

<script setup lang="ts">
    import { type BankAccount } from '@models/BankAccountTypes'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'

    const props = defineProps<{
        account: BankAccount
    }>()

    const bankAccountsStore = useBankAccountsStore()

    const deleteAccount = (accountId: string) => {
        if (confirm('Are you sure you want to delete this account?')) {
            bankAccountsStore.removeAccount(accountId)
            console.log(`Account with ID ${accountId} deleted.`)
        }
    }
</script>
