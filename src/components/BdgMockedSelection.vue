<template>
    <v-card class="pa-4 w-100">
        <v-card-title>Select Demo Data File</v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="6">
                    <v-select
                        v-model="selectedCategory"
                        :items="categories"
                        label="Demo Category"
                        item-title="title"
                        item-value="value"
                        @update:model-value="updateAvailableFiles"
                    ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-select
                        v-model="selectedLanguage"
                        :items="languages"
                        label="Language"
                        item-title="title"
                        item-value="value"
                        @update:model-value="updateAvailableFiles"
                    ></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-select
                        v-model="selectedFile"
                        :items="availableFiles"
                        label="Select Demo File"
                        :disabled="!availableFiles.length"
                    ></v-select>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" :disabled="!selectedFile" @click="selectMockedFile">
                Use Demo File
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'

    const props = defineProps<{
        preselectedCategory?: string
        preselectedLanguage?: string
    }>()

    const emit = defineEmits<{
        (e: 'select', filePath: string, fileContent: File): void
    }>()

    // Available categories and languages
    const categories = [
        { title: 'Bank Account', value: 'bank-account' },
        { title: 'Credit Card', value: 'creditcard' }
    ]

    const languages = [
        { title: 'English', value: 'en' },
        { title: 'French', value: 'fr' }
    ]

    // Selected values
    const selectedCategory = ref<string>(props.preselectedCategory || 'bank-account')
    const selectedLanguage = ref<string>(props.preselectedLanguage || 'en')
    const selectedFile = ref<string>('')

    // Define the type for our mocked files structure
    type LanguageFiles = {
        en: string[]
        fr: string[]
    }

    type MockedFilesType = {
        'bank-account': LanguageFiles
        creditcard: LanguageFiles
    }

    // Mock data files by category and language
    const mockedFiles: MockedFilesType = {
        'bank-account': {
            en: [
                'statement-august-2025.csv',
                'statement-july-2025.csv',
                'statement-june-2025.csv',
                'statement-september-2025.csv'
            ],
            fr: [
                'releve-aout-2025.csv',
                'releve-juillet-2025.csv',
                'releve-juin-2025.csv',
                'releve-septembre-2025.csv'
            ]
        },
        creditcard: {
            en: [
                'statement-january-2025.csv',
                'statement-february-2025.csv',
                'statement-march-2025.csv',
                'statement-april-2025.csv'
            ],
            fr: [
                'releve-janvier-2025.csv',
                'releve-fevrier-2025.csv',
                'releve-mars-2025.csv',
                'releve-avril-2025.csv'
            ]
        }
    }

    // Path to mocked data directory
    const mockedDataBasePath = '/mocked-data'

    // Computed available files based on selected category and language
    const availableFiles = computed(() => {
        if (!selectedCategory.value || !selectedLanguage.value) return []

        const category = selectedCategory.value as keyof MockedFilesType
        const language = selectedLanguage.value as keyof LanguageFiles

        const files = mockedFiles[category]?.[language]
        return files || []
    })

    // Update when selections change
    function updateAvailableFiles() {
        selectedFile.value = ''
    }

    // Function to emit the selected file path and content
    async function selectMockedFile() {
        if (!selectedFile.value) return

        const filePath = `${mockedDataBasePath}/${selectedCategory.value}/${selectedLanguage.value}/${selectedFile.value}`

        try {
            // Fetch the file content
            const response = await fetch(filePath)
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
            }

            const text = await response.text()
            const file = new File([text], selectedFile.value, { type: 'text/csv' })

            emit('select', filePath, file)
        } catch (error) {
            console.error('Error fetching file:', error)
        }
    }
</script>

<style scoped>
    .v-card {
        width: 100%;
    }

    .v-card-text {
        width: 100%;
    }

    .v-row {
        width: 100%;
        margin: 0;
    }
</style>
