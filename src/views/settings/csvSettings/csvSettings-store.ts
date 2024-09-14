import type { CSVColumnContent } from "@/core/models/csvDocument";
import type { CsvParseResult, CsvRow } from "@/core/services/CsvParser";
import { defineStore } from "pinia";
import { ref, type ModelRef, type Ref, defineModel } from "vue";

export type CsvColumnMappingItemModelValue = {
    csvColumnContent: CSVColumnContent | undefined;
};


export type CsvSettingsStore = {
    csvContentPreview: Ref<CsvParseResult | undefined>;
    csvRows: Ref<CsvRow[]>;
    columnsMappingModelValues: Ref<ModelRef<CsvColumnMappingItemModelValue>[]>;

    setCsvContentPreview: (csvContent: CsvParseResult) => void;
};


export const useCsvSettingsStore = defineStore<string, CsvSettingsStore>('csvSettings',  () => {

    const csvContentPreview = ref<CsvParseResult | undefined>();

    const csvRows = ref<CsvRow[]>([]);

    const columnsMappingModelValues: Ref<ModelRef<CsvColumnMappingItemModelValue>[]> = ref<[]>([]);

    function setCsvContentPreview(csvContent: CsvParseResult) {
        csvContentPreview.value = csvContent;

        const rows : CsvRow[] = [];

        if(csvContent.content.header) {
            rows.push(csvContent.content.header);
        }

        rows.push(...csvContent.content.rows);

        if (rows.length > 0) {
            const colsCount = rows[0].records.length || 0;
            const newItems: ModelRef<CsvColumnMappingItemModelValue>[] = [];

            for (let i = columnsMappingModelValues.value.length; i < colsCount; i++) {

                const model = defineModel<CsvColumnMappingItemModelValue>(`CsvColumnMappingItemModelValue-${i}`, {
                        default: () => ({
                            csvColumnContent: undefined
                        })
                    });

                newItems.push(model);
            }

            columnsMappingModelValues.value.push(...newItems);
        }

        csvRows.value = rows;
    }

    return {
        csvContentPreview,
        csvRows,
        columnsMappingModelValues,

        setCsvContentPreview
    };
});