<template>
    <v-container class="d-flex flex-column align-left justify-center">
        <h1 class="h1-header">CSV Columns Settings</h1>
        <div class="setting-name-container controls-container">
            <label for="setting-name" class="setting-name-label">Setting Name:</label>
            <v-text-field
                id="setting-name"
                v-model="settings.name"
                outlined
                dense
                clearable
                class="setting-name-input"
            />
        </div>
        <div class="controls-container">
            <v-file-input
                id="csv-file-input"
                label="Select CSV file"
                class="csv-file-input"
                v-model="csvFileName"
                @update:modelValue="onFileNameUpdated"
                accept=".csv"
                :multiple="true"
            ></v-file-input>
        </div>
        
        <!-- Directory selection option -->
        <div class="controls-container">
            <v-btn 
                @click="selectDirectory"
                class="mb-4"
            >
                Select Directory
            </v-btn>
            <span v-if="directoryName" class="directory-name ml-2">{{ directoryName }}</span>
            
            <!-- Hidden input for directory selection -->
            <input
                ref="directoryInput"
                type="file"
                webkitdirectory
                directory
                style="display: none"
                @change="handleDirectorySelection"
            />
        </div>

        <v-row class="mb-4">
            <v-col cols="12">
                <!-- <h2 class="mb-6">Selected row </h2> -->
                <v-select
                    v-model="currentRowIndex"
                    :items="rows"
                    item-value="lineNumber"
                    item-title="record"
                    density="compact"
                    variant="outlined"
                    hide-details
                    :disabled="!csvContentPresent"
                />
            </v-col>
        </v-row>

        <!-- Header -->
        <h2 class="text-center mt-4 mb-6">Match information with the right CSV column</h2>

        <!-- Matching Section -->
        <v-row class="mt-4 mb-4">
            <!-- Matching Constant Tags -->
            <v-col cols="12">
                <v-row v-if="settings">
                    <v-col cols="4" v-for="key in Object.keys(csvColumns)" :key="key">
                        <h3 class="text-center mb-4">{{ key }}</h3>
                        <v-select
                            :items="currentRow"
                            item-value="key"
                            item-title="text"
                            v-model="settings.columnsMapping[csvColumns[key]]"
                            label="Select a column..."
                            outlined
                            dense
                            clearable
                            :disabled="!csvContentPresent"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Matched Results Display -->
        <v-row v-if="csvContentPresent">
            <v-col cols="12">
                <h2 class="text-center mb-4">Matched results</h2>
                <ul>
                    <li v-for="index in Object.keys(csvColumns)" :key="index">
                        {{ index }} →
                        <strong>{{ getColumnText(index) }}</strong>
                    </li>
                </ul>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12" class="d-flex justify-end">
                <v-btn text class="mr-2" @click="cancel">Cancel</v-btn>
                <v-btn color="primary" @click="save">Save</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    h1,
    h2 {
        color: #4a4a4a;
        text-align: center;
    }
    
    .directory-name {
        display: flex;
        align-items: center;
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.6);
    }
</style>

<script setup lang="ts">
    import { computed, onMounted, ref, type Ref } from 'vue'
    import { useCsvPreviewStore } from './csvPreview-store'
    import { CSVColumnContent } from '@/core/models/csvDocument'
    import { container } from '@/core/setupInversify'
    import type { IStreamFactory } from '@services/StreamFactory'
    import type { CsvParseResult, ICsvParser } from '@services/CsvParser'
    import { ServicesTypes } from '@services/types'
    import { useRoute, useRouter } from 'vue-router'

    const router = useRouter()
    const route = useRoute()

    const csvPreviewStore = useCsvPreviewStore()
    // const mapping = csvPreviewStore.csvColumnContentMapping

    const settings = computed(() => {
        return csvPreviewStore.settings
    })

    const settingsId = computed(() => {
        return route.params.id as string
    })

    const csvFileName = defineModel<File[]>()
    const directoryInput = ref<HTMLInputElement | null>(null)
    const directoryName = ref<string>('')

    const csvColumns: { [key: string]: CSVColumnContent } = {
        'card number': CSVColumnContent.CARD_NUMBER,
        'date inscription': CSVColumnContent.DATE_INSCRIPTION,
        'date transaction': CSVColumnContent.DATE_TRANSACTION,
        amount: CSVColumnContent.AMOUNT,
        description: CSVColumnContent.DESCRIPTION,
        type: CSVColumnContent.TYPE
    }

    const csvContentPreview: Ref<CsvParseResult | null> = ref(null)
    const csvHeaderIndex: Ref<number> = ref(-1)
    const selectedColumn = ref(-1)

    const csvContentPresent = computed(() => csvPreviewStore.csvRows.length > 0)

    onMounted(() => {
        csvPreviewStore.clearCsvContentPreview()

        if (settingsId.value) {
            csvPreviewStore.loadSettings(settingsId.value)
        } else {
            csvPreviewStore.newSettings()
        }
    })

    const csvRows = computed(() => {
        return csvPreviewStore.csvRows.length > 0
            ? csvPreviewStore.csvRows
            : [
                  {
                      records: ['No CSV file selected']
                  }
              ]
    })

    const rows = computed(() =>
        csvRows.value.map((row: any, index: number) => {
            return {
                lineNumber: index,
                record: row?.records?.join(', ')
            }
        })
    )

    const currentRowIndex = ref(0)
    const currentRow = computed(() =>
        (csvPreviewStore.csvRows[currentRowIndex.value]?.records || []).reduce(
            (acc: any[], value: string, index: number) => {
                acc.push({
                    key: index,
                    text: value
                })
                return acc
            },
            []
        )
    )

    function save() {
        csvPreviewStore.saveSettings()
        router.go(-1)
    }

    function cancel() {
        router.go(-1)
    }

    function getColumnText(index: string): string {
        if (settings.value === undefined) {
            return ''
        }

        if (!csvContentPresent.value) {
            return ''
        }

        const mappingIndex = csvColumns[index]
        if (mappingIndex === undefined) {
            return 'None'
        }

        const rowIndex = settings.value.columnsMapping[mappingIndex] as number
        if (rowIndex === null) {
            return 'None'
        }

        return currentRow.value[rowIndex].text
    }

    async function onFileNameUpdated(files: File[] | File): Promise<void> {
        if (files) {
            const streamFactory = container.get<IStreamFactory>(ServicesTypes.StreamFactory)
            const csvParser = container.get<ICsvParser>(ServicesTypes.CsvParser)

            let file: File

            if (Array.isArray(files)) {
                file = files[0]
            } else {
                file = files as File
            }

            const inputStream = streamFactory.createFileReader(file)
            const text = await inputStream.read()

            csvParser.minimumColumnsCount = 4
            csvContentPreview.value = csvParser.parse(text)

            csvPreviewStore.setCsvContentPreview(csvContentPreview.value)

            csvHeaderIndex.value = -1
            selectedColumn.value = -1
            
            // Clear directory name if set
            directoryName.value = ''
        } else {
            csvContentPreview.value = null
            csvPreviewStore.clearCsvContentPreview()
        }
    }
    
    function selectDirectory() {
        if (directoryInput.value) {
            directoryInput.value.click()
        }
    }
    
    async function handleDirectorySelection(event: Event) {
        const target = event.target as HTMLInputElement
        if (target.files && target.files.length > 0) {
            // Convert FileList to array
            const filesArray = Array.from(target.files)
            
            // Filter to only include CSV files
            const csvFiles = filesArray.filter(file => file.name.toLowerCase().endsWith('.csv'))
            
            // Get directory name from the first file's path
            if (filesArray.length > 0) {
                const path = filesArray[0].webkitRelativePath
                directoryName.value = path.split('/')[0] || 'Selected Directory'
            }
            
            if (csvFiles.length > 0) {
                // We only process the first CSV file for preview
                await onFileNameUpdated(csvFiles[0])
                
                // Clear file input to avoid confusion
                if (csvFileName.value) {
                    csvFileName.value = []
                }
            } else {
                console.error('No CSV files found in the selected directory')
            }
        }
    }
</script>
