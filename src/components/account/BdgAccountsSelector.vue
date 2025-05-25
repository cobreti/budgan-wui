<template>
    <div>
        <div
            class="d-flex flex-row justify-start pa-0 ma-0"
            v-for="account in accounts"
            :key="account.accountId"
        >
            <v-checkbox
                multiple
                density="compact"
                :value="account.accountId"
                :label="account.name"
                v-model="selection"
            ></v-checkbox>
        </div>
    </div>
</template>

<style scoped></style>

<script setup lang="ts">
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import { computed } from 'vue'
    import type { BankAccountsSelection } from '@models/BankAccountSelectorTypes'

    const bankAccountsStore = useBankAccountsStore()
    const selection = defineModel<BankAccountsSelection>('selectedAccounts')

    const accounts = computed(() => {
        return Object.values(bankAccountsStore.accounts).map((account) => {
            return {
                accountId: account.accountId,
                name: account.name,
                selected: false
            }
        })
    })
</script>
