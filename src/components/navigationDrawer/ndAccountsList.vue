<template>
    <div class="ml-4">
        <div class="account-line mb-2" v-for="(account) in accounts" :key="account.accountId">
            <router-link :to="{path: `/account/${account.accountId}`, replace: true}">{{ account.accountId }}</router-link>
        </div>
    </div>
</template>

<style scoped>

    .account-line {
        display: block;
        min-width: 20em;
    }
</style>

<script setup lang="ts">
    import type { BankAccountsDictionary } from '@models/BankAccountTypes';
    import { useBankAccountsStore } from '@/stores/bankAccounts-store';
    import { computed, type ComputedRef } from 'vue';

    const store = useBankAccountsStore();

    const accounts: ComputedRef<BankAccountsDictionary> = computed(() => store.accounts);

</script>
