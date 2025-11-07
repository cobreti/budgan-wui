export const enum ColumnsType {
    CARD_NUMBER = 1,
    DATE_INSCRIPTION = 2,
    DATE_TRANSACTION = 3,
    AMOUNT = 4,
    DESCRIPTION = 5,
    TYPE = 6
}

export type Parameters = {
    startDate: Date
    endDate: Date
    minAmount?: number,
    maxAmount?: number,
    linesCount: number
    fileHeader: string | null
    columns: Array<ColumnsType>
}

export type StatementByColumns = {[key in ColumnsType]?: string[] };
