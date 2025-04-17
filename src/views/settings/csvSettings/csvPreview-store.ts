import { CSVColumnContent, type CSVColumnContentMapping } from "@/core/models/csvDocument";
import type { CsvParseResult, CsvRow } from "@/core/services/CsvParser";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";


export type CsvPreviewStore = {
    csvContentPreview: Ref<CsvParseResult | undefined>;
    csvRows: Ref<CsvRow[]>;
    csvColumnContentMapping: Ref<CSVColumnContentMapping>;

    setCsvContentPreview: (csvContent: CsvParseResult) => void;
};


export const useCsvPreviewStore = defineStore<string, CsvPreviewStore>('csvSettings',  () => {

    const csvContentPreview = ref<CsvParseResult | undefined>();

    const csvRows = ref<CsvRow[]>([]);

    const csvColumnContentMapping = ref<CSVColumnContentMapping>(Object.values(CSVColumnContent).reduce(
        (acc : CSVColumnContentMapping, column: any, value: number) => {
            const contentValue = CSVColumnContent[column as keyof typeof CSVColumnContent];
            acc[contentValue] = undefined;
            return acc;
        }, {} as CSVColumnContentMapping));

    function setCsvContentPreview(csvContent: CsvParseResult) {
        csvContentPreview.value = csvContent;

        const rows : CsvRow[] = [];

        if(csvContent.content.header) {
            rows.push(csvContent.content.header);
        }

        rows.push(...csvContent.content.rows);

        csvRows.value = rows;
    }

    return {
        csvContentPreview,
        csvRows,
        csvColumnContentMapping,

        setCsvContentPreview
    };
});