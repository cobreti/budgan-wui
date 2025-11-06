import { parameters } from "./parameters.ts";
import { generateRandomDates } from './utilities.ts'

console.log("Statement Generator tools starting");

console.log( `start date : ${parameters.startDate}`)
console.log(`end date : ${parameters.endDate}`)

const dates = generateRandomDates(parameters);

dates.forEach(date => console.log(date.toLocaleDateString('en-CA')));