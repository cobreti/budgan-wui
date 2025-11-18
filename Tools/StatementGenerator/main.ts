import { StatementGenerator } from './core/statement-generator.ts'
import { ColumnsType } from './core/types.ts'

console.log("Statement Generator tools starting");

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
    .selectRandomDescriptions()
    .generateStatement()
    .saveStatement(outFile)
    .then(() => console.log('Statement saved successfully'))
    .catch((error) => console.error('Error generating statement:', error));
