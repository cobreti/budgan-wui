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
                        @update:model-value="updateCategoryAndFiles"
                    ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                    <v-select
                        v-model="selectedLanguage"
                        :items="languages"
                        label="Language"
                        item-title="title"
                        item-value="value"
                        @update:model-value="updateCategoryAndFiles"
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
                            @update:model-value="handleSelectionChange"
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
    </v-card>
</template>

<script setup lang="ts">
    import { ref, computed, nextTick } from 'vue'

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

        // Auto-select first file if available and we're in single mode
        if (props.singleSelect && files && files.length > 0 && !selectedFiles.value) {
            // Use nextTick to avoid changing reactive properties during render
            nextTick(() => {
                selectedFiles.value = files[0]
                handleSelectionChange()
            })
        }

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

    // Update when category or language changes
    async function updateCategoryAndFiles() {
        // Update available files first
        selectedFiles.value = props.singleSelect ? '' : []

        // Wait for the next tick to ensure files are populated
        await nextTick()

        // Auto-select the first file if in single-select mode and files are available
        if (props.singleSelect && availableFiles.value.length > 0) {
            selectedFiles.value = availableFiles.value[0]
            await handleSelectionChange()
        }
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

    // Function to handle selection changes and automatically trigger the selection process
    async function handleSelectionChange() {
        if (getSelectedFilesCount() > 0) {
            await selectMockedFile()
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
    }

    // Note: Download functionality has been removed as we now use direct selection
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
