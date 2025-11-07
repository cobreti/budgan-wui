import { parameters } from "./parameters.ts";
import { generateAmounts, generateRandomDates, selectRandomCardNumber, selectRandomDescriptions } from './utilities.ts'
import { ColumnsType, type StatementByColumns, type Parameters } from './types.ts'

console.log("Statement Generator tools starting");

console.log( `start date : ${parameters.startDate}`)
console.log(`end date : ${parameters.endDate}`)

function generateStatement(params: Parameters): StatementByColumns {
    const statement: StatementByColumns = {}

    const dates = generateRandomDates(params);
    const cardNumber = selectRandomCardNumber()
    const descriptions = selectRandomDescriptions(params)

    params.columns.forEach(column => {
        switch (column) {
            case ColumnsType.DATE_INSCRIPTION:
                statement[ColumnsType.DATE_INSCRIPTION] = dates.map((date) =>
                    date.toLocaleDateString('en-CA')
                )
                break;
            case ColumnsType.DATE_TRANSACTION:
                statement[ColumnsType.DATE_TRANSACTION] = dates.map((date) =>
                    date.toLocaleDateString('en-CA')
                )
                break;
            case ColumnsType.CARD_NUMBER:
                statement[ColumnsType.CARD_NUMBER] = Array(params.linesCount).fill(cardNumber)
                break;
            case ColumnsType.DESCRIPTION:
                statement[ColumnsType.DESCRIPTION] = descriptions.map((d) => d.description)
                break;
            case ColumnsType.AMOUNT:
                statement[ColumnsType.AMOUNT] = generateAmounts(params).map((a) => a.toString())
                break;
        }
    })

    return statement
}


const statement = generateStatement(parameters)

console.log(statement)
