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
            <v-card class="csv-input-card">
                <v-tabs v-model="activeTab">
                    <v-tab value="upload">Upload File</v-tab>
                    <v-tab value="mocked">Use Demo Data</v-tab>
                </v-tabs>

                <v-card-text class="content-container">
                    <v-window v-model="activeTab" class="window-height w-100">
                        <!-- Upload File Tab -->
                        <v-window-item value="upload" class="w-100">
                            <div class="d-flex flex-column mb-2 mt-4 full-width-container">
                                <v-file-input
                                    id="csv-file-input"
                                    label="Select CSV file"
                                    class="full-width-input"
                                    v-model="csvFileName"
                                    @update:modelValue="onFileNameUpdated"
                                    accept=".csv"
                                    :multiple="false"
                                ></v-file-input>
                            </div>
                        </v-window-item>

                        <!-- Demo Data Tab -->
                        <v-window-item value="mocked" class="w-100">
                            <div class="mt-4 full-width-container">
                                <bdg-mocked-selection
                                    class="full-width-component"
                                    preselectedCategory="bank-account"
                                    @select="onMockedFileSelected"
                                    :singleSelect="true"
                                ></bdg-mocked-selection>
                            </div>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>
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

    .csv-input-card {
        position: relative;
        margin-bottom: 1rem;
    }

    .content-container {
        min-height: 20em;
    }

    .window-height {
        min-height: 18em;
        width: 100%;
    }

    /* Ensure full width for input containers */
    .full-width-container {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .full-width-input {
        width: 100%;
    }

    .full-width-component {
        width: 100%;
    }
</style>

<script setup lang="ts">
    import { computed, onMounted, ref, type Ref } from 'vue'
    import { useCsvPreviewStore } from '@/stores/csvPreview-store'
    import { CSVColumnContent } from '@/core/models/csvDocument'
    import { container } from '@/core/setupInversify'
    import type { IStreamFactory } from '@services/StreamFactory'
    import type { CsvParseResult, ICsvParser } from '@services/CsvParser'
    import { ServicesTypes } from '@services/types'
    import { useRoute, useRouter } from 'vue-router'
    import BdgMockedSelection from '@/components/BdgMockedSelection.vue'

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

    // Tab selection for file input methods
    const activeTab = ref('upload')

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
        } else {
            csvContentPreview.value = null
            csvPreviewStore.clearCsvContentPreview()
        }
    }

    // Handler for when a demo file is selected
    async function onMockedFileSelected(_filePath: string, fileContent: File): Promise<void> {
        // Use the file content as if it was uploaded via file input
        await onFileNameUpdated(fileContent)
    }
</script>
