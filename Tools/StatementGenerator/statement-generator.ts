import { parameters } from "./parameters.ts";
import {
    generateStatement
} from './utilities.ts'

console.log("Statement Generator tools starting");

console.log( `start date : ${parameters.startDate}`)
console.log(`end date : ${parameters.endDate}`)



const statement = generateStatement(parameters)

console.log(statement)
