<template>
    <v-card class="ma-10 position-relative">
        <v-icon
            class="delete-icon"
            color="error"
            size="small"
            @click="confirmDelete(props.account.accountId)"
            title="Delete account"
        >
            mdi-delete
        </v-icon>
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
            </div>
        </v-card-text>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="showDeleteDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">Confirm Deletion</v-card-title>
                <v-card-text>
                    Are you sure you want to delete this account? This action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="cancelDelete">Cancel</v-btn>
                    <v-btn color="red darken-1" text @click="deleteAccount">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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

    .delete-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s ease;
    }

    .delete-icon:hover {
        opacity: 1;
    }
</style>

<script setup lang="ts">
    import { type BankAccount } from '@models/BankAccountTypes'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'
    import { ref } from 'vue'

    const props = defineProps<{
        account: BankAccount
    }>()

    const bankAccountsStore = useBankAccountsStore()

    // Dialog state variables
    const showDeleteDialog = ref(false)
    const accountIdToDelete = ref<string | null>(null)

    const confirmDelete = (accountId: string) => {
        accountIdToDelete.value = accountId
        showDeleteDialog.value = true
    }

    const deleteAccount = () => {
        if (accountIdToDelete.value) {
            bankAccountsStore.removeAccount(accountIdToDelete.value)
            console.log(`Account with ID ${accountIdToDelete.value} deleted.`)
            showDeleteDialog.value = false
            accountIdToDelete.value = null
        }
    }

    const cancelDelete = () => {
        showDeleteDialog.value = false
        accountIdToDelete.value = null
    }
</script>
