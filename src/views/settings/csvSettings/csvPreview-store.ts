import { CSVColumnContent, type CSVSettings } from "@/core/models/csvDocument";
import type { CsvParseResult, CsvRow } from "@/core/services/CsvParser";
import { useCsvSettingsStore } from "@/stores/csvSettings-store";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";


export type CsvPreviewStore = {
    csvContentPreview: Ref<CsvParseResult | undefined>;
    csvRows: Ref<CsvRow[]>;
    settings: CSVSettings;
    // csvColumnContentMapping: Ref<CSVColumnContentMapping>;

    setCsvContentPreview: (csvContent: CsvParseResult) => void;
    clearCsvContentPreview: () => void;
    newSettings: () => CSVSettings;
    save: () => void;
};


export const useCsvPreviewStore = defineStore<string, CsvPreviewStore>('csvPreview',  () => {

    const csvSettingsStore = useCsvSettingsStore();

    const csvContentPreview = ref<CsvParseResult | undefined>();

    const csvRows = ref<CsvRow[]>([]);

    const originalSettings = ref<CSVSettings | undefined>(undefined);

    const settings = ref<CSVSettings>({
        id: "",
        name: "",
        delimiter: ",",
        columnsMapping: {
            [CSVColumnContent.CARD_NUMBER]: null,
            [CSVColumnContent.DATE_INSCRIPTION]: null,
            [CSVColumnContent.DATE_TRANSACTION]: null,
            [CSVColumnContent.AMOUNT]: null,
            [CSVColumnContent.DESCRIPTION]: null,
            [CSVColumnContent.TYPE]: null
        }
    });
    // const csvColumnContentMapping = ref<CSVColumnContentMapping>(Object.values(CSVColumnContent).reduce(
    //     (acc : CSVColumnContentMapping, column: any, value: number) => {
    //         const contentValue = CSVColumnContent[column as keyof typeof CSVColumnContent];
    //         acc[contentValue] = null;
    //         return acc;
    //     }, {} as CSVColumnContentMapping));

    function setCsvContentPreview(csvContent: CsvParseResult) {
        csvContentPreview.value = csvContent;

        const rows : CsvRow[] = [];

        if(csvContent.content.header) {
            rows.push(csvContent.content.header);
        }

        rows.push(...csvContent.content.rows);

        csvRows.value = rows;
    }

    function clearCsvContentPreview() {
        csvContentPreview.value = undefined;
        csvRows.value = [];
    }

    function newSettings() {
        originalSettings.value = undefined;
        settings.value = {
            id: crypto.randomUUID(),
            name: "",
            delimiter: ",",
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

    function save() {
        if (originalSettings.value) {
            csvSettingsStore.removeSetting(originalSettings.value.id);
        }

        const newSetting = {
            ...settings.value,
            name: settings.value.name || `CSV Settings ${new Date().toLocaleDateString()}`
        };

        csvSettingsStore.addSetting(newSetting);

        originalSettings.value = newSetting;
    }

    return {
        csvContentPreview,
        csvRows,
        settings,

        setCsvContentPreview,
        clearCsvContentPreview,
        newSettings,
        save
    };
});