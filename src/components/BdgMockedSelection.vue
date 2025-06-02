<template>
    <v-card class="pa-4 w-100">
        <v-card-title>{{
            props.singleSelect ? 'Select Demo Data File' : 'Select Demo Data Files'
        }}</v-card-title>
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
                    <div class="d-flex flex-column">
                        <v-select
                            v-model="selectedFiles"
                            :items="availableFiles"
                            :label="props.singleSelect ? 'Select Demo File' : 'Select Demo File(s)'"
                            :disabled="!availableFiles.length"
                            :multiple="!props.singleSelect"
                            chips
                            :hint="props.singleSelect ? undefined : 'You can select multiple files'"
                            :persistent-hint="!props.singleSelect"
                        ></v-select>
                        <div
                            class="d-flex justify-end mt-1"
                            v-if="availableFiles.length && !props.singleSelect"
                        >
                            <v-btn
                                variant="text"
                                size="small"
                                density="comfortable"
                                @click="selectAllFiles"
                                :disabled="isAllSelected"
                            >
                                Select All
                            </v-btn>
                            <v-btn
                                v-if="Array.isArray(selectedFiles) && selectedFiles.length > 0"
                                variant="text"
                                size="small"
                                density="comfortable"
                                @click="clearSelection"
                                class="ml-2"
                            >
                                Clear
                            </v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <div v-if="getSelectedFilesCount() > 0" class="file-counter">
                <v-chip color="info" size="small">
                    {{ getSelectedFilesCount() }} file{{ getSelectedFilesCount() > 1 ? 's' : '' }}
                    selected
                </v-chip>
            </div>
            <v-spacer></v-spacer>
            <v-btn
                variant="outlined"
                color="secondary"
                :disabled="getSelectedFilesCount() === 0"
                @click="downloadDemoFiles"
                class="mr-2"
                prepend-icon="mdi-download"
            >
                Download {{ props.singleSelect ? 'File' : 'Files' }}
            </v-btn>
            <v-btn
                color="primary"
                :disabled="getSelectedFilesCount() === 0"
                @click="selectMockedFile"
                prepend-icon="mdi-check"
            >
                Use Demo {{ props.singleSelect ? 'File' : 'Files' }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
    import { ref, computed } from 'vue'

    const props = defineProps<{
        preselectedCategory?: string
        preselectedLanguage?: string
        singleSelect?: boolean
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
    const selectedFiles = ref<string | string[]>(props.singleSelect ? '' : [])

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

    // Check if all files are selected
    const isAllSelected = computed(() => {
        if (props.singleSelect) {
            return false // Not applicable in single selection mode
        }
        return (
            availableFiles.value.length > 0 &&
            (selectedFiles.value as string[]).length === availableFiles.value.length
        )
    })

    // Update when selections change
    function updateAvailableFiles() {
        selectedFiles.value = props.singleSelect ? '' : []
    }

    // Select all available files
    function selectAllFiles() {
        if (!props.singleSelect) {
            selectedFiles.value = [...availableFiles.value] as string[]
        }
    }

    // Clear all selections
    function clearSelection() {
        selectedFiles.value = props.singleSelect ? '' : []
    }

    // Helper function to get the number of selected files
    function getSelectedFilesCount(): number {
        if (props.singleSelect) {
            return selectedFiles.value ? 1 : 0
        } else {
            return (selectedFiles.value as string[]).length
        }
    }

    // Function to emit the selected file paths and contents
    async function selectMockedFile() {
        if (getSelectedFilesCount() === 0) return

        // Handle single file selection mode
        if (props.singleSelect && typeof selectedFiles.value === 'string') {
            const fileName = selectedFiles.value
            const filePath = `${mockedDataBasePath}/${selectedCategory.value}/${selectedLanguage.value}/${fileName}`

            try {
                // Fetch the file content
                const response = await fetch(filePath)
                if (!response.ok) {
                    console.error(`Failed to fetch file: ${response.status} ${response.statusText}`)
                    return
                }

                const text = await response.text()
                const file = new File([text], fileName, { type: 'text/csv' })

                emit('select', filePath, file)
            } catch (error) {
                console.error('Error fetching file:', error)
            }
        }
        // Handle multiple file selection mode
        else if (Array.isArray(selectedFiles.value)) {
            for (const fileName of selectedFiles.value) {
                const filePath = `${mockedDataBasePath}/${selectedCategory.value}/${selectedLanguage.value}/${fileName}`

                try {
                    // Fetch the file content
                    const response = await fetch(filePath)
                    if (!response.ok) {
                        console.error(
                            `Failed to fetch file: ${response.status} ${response.statusText}`
                        )
                        continue
                    }

                    const text = await response.text()
                    const file = new File([text], fileName, { type: 'text/csv' })

                    emit('select', filePath, file)
                } catch (error) {
                    console.error('Error fetching file:', error)
                }
            }
        }
    } // Function to download the selected demo files
    async function downloadDemoFiles() {
        if (getSelectedFilesCount() === 0) return

        // Handle single file selection mode
        if (props.singleSelect && typeof selectedFiles.value === 'string') {
            const fileName = selectedFiles.value
            const filePath = `${mockedDataBasePath}/${selectedCategory.value}/${selectedLanguage.value}/${fileName}`

            try {
                // Fetch the file content
                const response = await fetch(filePath)
                if (!response.ok) {
                    console.error(`Failed to fetch file: ${response.status} ${response.statusText}`)
                    return
                }

                // Create a blob from the response
                const blob = await response.blob()

                // Create a temporary anchor element to download the file
                const downloadLink = document.createElement('a')
                downloadLink.href = URL.createObjectURL(blob)
                downloadLink.download = fileName

                // Append to the document, trigger click, and clean up
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)

                // Release the URL object
                URL.revokeObjectURL(downloadLink.href)
            } catch (error) {
                console.error('Error downloading file:', error)
            }
        }
        // Handle multiple file selection mode
        else if (Array.isArray(selectedFiles.value)) {
            for (const fileName of selectedFiles.value) {
                const filePath = `${mockedDataBasePath}/${selectedCategory.value}/${selectedLanguage.value}/${fileName}`

                try {
                    // Fetch the file content
                    const response = await fetch(filePath)
                    if (!response.ok) {
                        console.error(
                            `Failed to fetch file: ${response.status} ${response.statusText}`
                        )
                        continue
                    }

                    // Create a blob from the response
                    const blob = await response.blob()

                    // Create a temporary anchor element to download the file
                    const downloadLink = document.createElement('a')
                    downloadLink.href = URL.createObjectURL(blob)
                    downloadLink.download = fileName

                    // Append to the document, trigger click, and clean up
                    document.body.appendChild(downloadLink)
                    downloadLink.click()
                    document.body.removeChild(downloadLink)

                    // Release the URL object
                    URL.revokeObjectURL(downloadLink.href)
                } catch (error) {
                    console.error('Error downloading file:', error)
                }
            }
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

    .file-counter {
        display: flex;
        align-items: center;
    }
</style>
