import { ColumnsType, type Parameters } from './types.ts'

export const parameters: Parameters = {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    minAmount: 10,
    maxAmount: 1000,
    linesCount: 10,
    fileHeader: null,
    columns: [
        ColumnsType.CARD_NUMBER,
        ColumnsType.DESCRIPTION,
        ColumnsType.DATE_TRANSACTION,
        ColumnsType.DATE_INSCRIPTION,
        ColumnsType.AMOUNT
    ]
}
