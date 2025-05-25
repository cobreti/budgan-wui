import { CSVColumnContent, type CSVSettings } from '@/core/models/csvDocument'
import type { CsvParseResult, CsvRow } from '@/core/services/CsvParser'
import { useCsvSettingsStore } from '@/stores/csvSettings-store'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type CsvPreviewStore = {
    csvContentPreview: Ref<CsvParseResult | undefined>
    csvRows: Ref<CsvRow[]>
    settings: Ref<CSVSettings>

    setCsvContentPreview: (csvContent: CsvParseResult) => void
    clearCsvContentPreview: () => void
    newSettings: () => void
    saveSettings: () => void
    loadSettings: (id: string) => void
    clearSettings: () => void
}

export const useCsvPreviewStore = defineStore<string, CsvPreviewStore>('csvPreview', () => {
    const csvSettingsStore = useCsvSettingsStore()

    const csvContentPreview = ref<CsvParseResult | undefined>()

    const csvRows = ref<CsvRow[]>([])

    const originalSettings = ref<CSVSettings | undefined>(undefined)

    const settings = ref<CSVSettings>({
        id: '',
        name: '',
        delimiter: ',',
        columnsMapping: {
            [CSVColumnContent.CARD_NUMBER]: null,
            [CSVColumnContent.DATE_INSCRIPTION]: null,
            [CSVColumnContent.DATE_TRANSACTION]: null,
            [CSVColumnContent.AMOUNT]: null,
            [CSVColumnContent.DESCRIPTION]: null,
            [CSVColumnContent.TYPE]: null
        }
    })
    // const csvColumnContentMapping = ref<CSVColumnContentMapping>(Object.values(CSVColumnContent).reduce(
    //     (acc : CSVColumnContentMapping, column: any, value: number) => {
    //         const contentValue = CSVColumnContent[column as keyof typeof CSVColumnContent];
    //         acc[contentValue] = null;
    //         return acc;
    //     }, {} as CSVColumnContentMapping));

    function setCsvContentPreview(csvContent: CsvParseResult) {
        csvContentPreview.value = csvContent

        const rows: CsvRow[] = []

        if (csvContent.content.header) {
            rows.push(csvContent.content.header)
        }

        rows.push(...csvContent.content.rows)

        csvRows.value = rows
    }

    function clearCsvContentPreview(): void {
        csvContentPreview.value = undefined
        csvRows.value = []
    }

    function newSettings(): void {
        originalSettings.value = undefined
        settings.value = {
            id: crypto.randomUUID(),
            name: '',
            delimiter: ',',
            columnsMapping: {
                [CSVColumnContent.CARD_NUMBER]: null,
                [CSVColumnContent.DATE_INSCRIPTION]: null,
                [CSVColumnContent.DATE_TRANSACTION]: null,
                [CSVColumnContent.AMOUNT]: null,
                [CSVColumnContent.DESCRIPTION]: null,
                [CSVColumnContent.TYPE]: null
            }
        }
    }

    function saveSettings(): void {
        if (originalSettings.value) {
            csvSettingsStore.removeSetting(originalSettings.value.id)
        }

        const newSetting = {
            ...settings.value,
            name: settings.value.name || `CSV Settings ${new Date().toLocaleDateString()}`
        }

        csvSettingsStore.addSetting(newSetting)

        originalSettings.value = newSetting
    }

    function loadSettings(id: string): void {
        const setting = csvSettingsStore.settings.find((setting) => setting.id === id)

        if (setting) {
            originalSettings.value = setting
            settings.value = {
                ...setting
            }
        }
    }

    function clearSettings(): void {
        settings.value = {
            id: '',
            name: '',
            delimiter: ',',
            columnsMapping: {
                [CSVColumnContent.CARD_NUMBER]: null,
                [CSVColumnContent.DATE_INSCRIPTION]: null,
                [CSVColumnContent.DATE_TRANSACTION]: null,
                [CSVColumnContent.AMOUNT]: null,
                [CSVColumnContent.DESCRIPTION]: null,
                [CSVColumnContent.TYPE]: null
            }
        }

        originalSettings.value = undefined
    }

    return {
        csvContentPreview,
        csvRows,
        settings,

        setCsvContentPreview,
        clearCsvContentPreview,
        newSettings,
        saveSettings,
        loadSettings,
        clearSettings
    }
})
