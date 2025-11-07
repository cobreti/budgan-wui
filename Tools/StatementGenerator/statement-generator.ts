import { parameters } from "./parameters.ts";
import { generateRandomDates, selectRandomCardNumber, selectRandomDescriptions } from './utilities.ts'

console.log("Statement Generator tools starting");

console.log( `start date : ${parameters.startDate}`)
console.log(`end date : ${parameters.endDate}`)

const dates = generateRandomDates(parameters);

dates.forEach(date => console.log(date.toLocaleDateString('en-CA')));

const cardNumber = selectRandomCardNumber();

console.log(`Card Number : ${cardNumber}`);

const descriptions = selectRandomDescriptions(parameters);

descriptions.forEach(description => console.log(description));
