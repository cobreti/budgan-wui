import { parameters } from "./core/parameters.ts";
import {
    generateStatement,
    saveStatementAsCsv
} from './core/utilities.ts'

console.log("Statement Generator tools starting");

console.log( `start date : ${parameters.startDate}`)
console.log(`end date : ${parameters.endDate}`)

async function main() {
    // Optional: receive an output filepath as the first CLI argument
    const [outFile] = process.argv.slice(2)

    const statement = generateStatement(parameters)

    if (outFile) {
        try {
            await saveStatementAsCsv(outFile, parameters, statement)
            console.log(`Statement saved to: ${outFile}`)
        } catch (err) {
            console.error('Failed to save statement:', err)
            process.exitCode = 1
        }
    } else {
        console.log(statement)
    }
}

main().catch((err) => {
    console.error('Unexpected error:', err)
    process.exitCode = 1
})
