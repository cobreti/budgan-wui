<template>
    <div>
        <v-toolbar class="pl-5">
            <a @click="$router.go(-1)">
                <v-icon size="Large" icon="mdi-chevron-left"></v-icon>
            </a>
        </v-toolbar>
        <div class="ma-5 form">
            <v-form fast-fail @submit.prevent v-model="formValid">
                <v-text-field
                    label="Account Name"
                    required
                    :rules="accountNameRules"
                    v-model="accountName"
                ></v-text-field>
                <v-text-field
                    label="Account Number"
                    required
                    :rules="accountNumberRules"
                    v-model="accountNumber"
                ></v-text-field>
                <v-select
                    required
                    label="Account Type"
                    :items="accountTypes"
                    :rules="accountTypeRule"
                    v-model="accountType"
                ></v-select>
                <v-select
                    required
                    label="CSV Setting"
                    :items="csvSettings"
                    v-model="selectedCsvSetting"
                    :item-value="'id'"
                    :item-title="'name'"
                    :rules="csvSettingRules"
                ></v-select>
                <div class="text-right mb-4">
                    <router-link
                        :to="{ path: '/settings', query: { from: 'newAccount' } }"
                        class="text-decoration-none"
                    >
                        <v-icon small class="mr-1">mdi-cog</v-icon>
                        Manage CSV Settings
                    </router-link>
                </div>
                <v-btn
                    type="submit"
                    @click="createAccount"
                    color="primary"
                    :disabled="!formValid"
                    block
                    >Create Account</v-btn
                >
            </v-form>
        </div>
    </div>
</template>

<style scoped>
    a {
        cursor: pointer;
    }

    .form {
        max-width: 40em;
    }
</style>

<script setup lang="ts">
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import type { BankAccount } from '@models/BankAccountTypes'
    import router from '@/router'
    import { computed } from 'vue'
    import { useCsvSettingsStore } from '@/stores/csvSettings-store'

    const bankAccountStore = useBankAccountsStore()
    const csvSettingsStore = useCsvSettingsStore()

    const accountName = defineModel<string>('accountName', { required: true })
    const accountNumber = defineModel<string>('accountNumber', { required: true })
    const accountType = defineModel<string>('accountType', { required: true })
    const formValid = defineModel<boolean>('formValid')
    const accountTypes = ['Checking', 'Savings', 'Credit Card']
    const csvSettings = computed(() => csvSettingsStore.settings)
    const selectedCsvSetting = defineModel<string>('selectedCsvSetting', { required: true })

    const accountNames = computed(() => {
        return Object.values(bankAccountStore.accounts).map((account) => account.name)
    })

    const accountNameRules = [
        (v: string) => {
            if (!v) return 'Account name is required'

            if (accountNames.value.includes(v)) return 'Account name already exists'

            return true
        }
    ]

    const accountNumberRules = [
        (v: string) => {
            if (!v) return 'Account number is required'

            const account = bankAccountStore.getAccountByIdIfExist(v)
            if (account) return 'Account number already exists'

            return true
        }
    ]

    const accountTypeRule = [
        (v: string) => {
            if (!v) return 'Account type is required'

            return true
        }
    ]

    const csvSettingRules = [
        (v: string) => {
            if (!v) return 'CSV setting is required'

            return true
        }
    ]

    async function createAccount() {
        const bankAccount: BankAccount = {
            name: accountName.value,
            accountId: accountNumber.value,
            accountType: accountType.value,
            transactionsGroups: [],
            transactions: [],
            csvSettingId: selectedCsvSetting.value
        }

        bankAccountStore.addWithBankAccount(bankAccount)

        router.go(-1)
    }
</script>
