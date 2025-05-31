<template>
    <div>
        <v-card class="d-flex flex-column ma-2 pa-2">
            <div class="d-flex flex-row mb-2">
                <div class="d-flex flex-column justify-center mr-4 mb-4">
                    <label for="ofx-file-input"> File </label>
                </div>
                <v-file-input
                    id="ofx-file-input"
                    class=""
                    v-model="files"
                    accept=".json"
                    :multiple="false"
                ></v-file-input>
            </div>
            <div class="d-flex flex-row justify-center">
                <v-btn @click="onImport" :disabled="!canImport">Import</v-btn>
            </div>
        </v-card>
    </div>
</template>

<style scoped></style>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { container } from '@/core/setupInversify'
    import { ServicesTypes } from '@/core/services/types'
    import type { IAccountDataSerializer } from '@/core/services/AccountDataSerializer'

    const serializer = container.get<IAccountDataSerializer>(ServicesTypes.AccountDataSerializer)
    const files = ref<File | undefined>()

    const canImport = computed(() => {
        return !!files.value
    })

    async function onImport() {
        if (files.value) {
            try {
                // Read the file content
                const fileContent = await readFileAsText(files.value)

                // Use the serializer to import all data (bank accounts and CSV settings)
                serializer.importAllData(fileContent)

                // Reset the file input
                files.value = undefined
            } catch (error) {
                console.error('Error importing accounts data:', error)
            }
        }
    }

    function readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = () => {
                try {
                    resolve(reader.result as string)
                } catch (e) {
                    reject(e)
                }
            }

            reader.onerror = () => {
                reject(new Error('Error reading file'))
            }

            reader.readAsText(file)
        })
    }
</script>
