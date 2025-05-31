<template>
    <div>
        <v-card class="d-flex flex-column ma-2 pa-2">
            <div class="d-flex flex-row mb-2">
                <v-text-field
                    class="filename-input"
                    label="Name"
                    v-model="filename"
                    :rules="[
                        (v: string) => !!v || 'Field is required',
                        (v: string) =>
                            /^[\w-]+$/.test(v) ||
                            'Name must only contain alphabets, numeric, _ and -',
                        (v: string) => /^[a-zA-Z].*$/.test(v) || 'Name must start with a letter'
                    ]"
                ></v-text-field>
            </div>
            <div class="ml-2 mt-4">
                <div class="mb-4 font-weight-black">
                    All account data and CSV settings will be exported
                </div>
            </div>
            <div class="d-flex flex-row justify-center">
                <v-btn
                    :href="accountsDataObjectUrl"
                    :download="computedFilename"
                    :disabled="!canDownload"
                    >Export</v-btn
                >
            </div>
        </v-card>
    </div>
</template>

<style scoped></style>

<script setup lang="ts">
    import { computed, ref, watchEffect, onMounted } from 'vue'
    import { container } from '@/core/setupInversify'
    import { ServicesTypes } from '@/core/services/types'
    import type { IAccountDataSerializer } from '@/core/services/AccountDataSerializer'
    import { onBeforeRouteLeave } from 'vue-router'
    import { useBankAccountsStore } from '@/stores/bankAccounts-store'

    const bankAccountsStore = useBankAccountsStore()
    const serializer = container.get<IAccountDataSerializer>(ServicesTypes.AccountDataSerializer)

    const accountsDataObjectUrl = ref<string>('')
    const filename = ref<string>('')

    const computedFilename = computed(() => {
        if (filename.value == '') return ''
        return `${filename.value}.json`
    })

    const canDownload = computed(() => {
        return (
            filename.value != '' &&
            bankAccountsStore.hasAccounts &&
            accountsDataObjectUrl.value != ''
        )
    })

    function updateDataUrl() {
        if (!bankAccountsStore.hasAccounts) {
            accountsDataObjectUrl.value = ''
            return
        }

        const json = serializer.exportAllData()
        const blob = new Blob([json], { type: 'application/json' })
        accountsDataObjectUrl.value = URL.createObjectURL(blob)
    }

    // Update the export data anytime bank accounts change
    const storeUnwatch = watchEffect(() => {
        updateDataUrl()
    })

    onMounted(() => {
        updateDataUrl()
    })

    onBeforeRouteLeave((to, from, next) => {
        storeUnwatch()
        if (accountsDataObjectUrl.value) {
            URL.revokeObjectURL(accountsDataObjectUrl.value)
        }
        next()
    })
</script>
