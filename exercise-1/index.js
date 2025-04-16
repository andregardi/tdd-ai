const wordsToNumbers = require('words-to-numbers').wordsToNumbers;

function processNumber(number) {
  if (number % 15 === 0) return 'pineapple';
  if (number % 3 === 0) return 'pine';
  if (number % 5 === 0) return 'apple';
  return number;
}

function myFunction(input) {
  // If input is a string
  if (typeof input === 'string') {
    // Try to convert string to number using the library
    const possibleNumber = wordsToNumbers(input);
    
    // If conversion was successful and result is a number
    if (typeof possibleNumber === 'number') {
      // Apply the same logic as numbers
      return processNumber(possibleNumber);
    }
    
    // If not a number word, return greeting
    return `Hello ${input}`;
  }
  
  // If input is a number, apply the original logic
  return processNumber(input);
}

module.exports = { myFunction }; 