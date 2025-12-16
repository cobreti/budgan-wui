import { StatementGenerator } from './core/statement-generator.ts'
import { ColumnsType } from './core/types.ts'
import { transactionDescriptions } from './data/transaction-descriptions.ts'

console.log('Statement Generator tools starting')

const [outFile] = process.argv.slice(2)

new StatementGenerator()
    .setDateRange(new Date(2024, 0, 1), new Date(2024, 11, 31))
    .setLinesCount(10)
    .setAmountRange(10, 1000)
    .setColumns(
        ColumnsType.CARD_NUMBER,
        ColumnsType.DESCRIPTION,
        ColumnsType.DATE_TRANSACTION,
        ColumnsType.DATE_INSCRIPTION,
        ColumnsType.AMOUNT
    )
    .generateAmounts()
    .generateRandomDates()
    .selectRandomCardNumber()
    .selectRandomDescriptions([transactionDescriptions[3].description])
    .generateStatement()
    .addStatementRow([
        {
            column: ColumnsType.CARD_NUMBER
        },
        {
            column: ColumnsType.DESCRIPTION,
            value: transactionDescriptions[3].description
        },
        {
            column: ColumnsType.DATE_TRANSACTION,
            value: new Date(2024, 1, 1)
        },
        {
            column: ColumnsType.DATE_INSCRIPTION,
            value: new Date(2024, 1, 1)
        },
        {
            column: ColumnsType.AMOUNT,
            value: 100
        }
    ])
    .saveStatement(outFile)
    .then(() => console.log('Statement saved successfully'))
    .catch((error) => console.error('Error generating statement:', error))
