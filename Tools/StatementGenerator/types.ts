export const enum ColumnsTypes {
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
    linesCount: number
    fileHeader: string | null
    columns: Array<{ type: ColumnsTypes; header: string }>
}
