// Implementation code will be added here 
function myFunction(num) {
  if (num % 15 === 0) return 'pineapple';
  if (num % 3 === 0) return 'pine';
  if (num % 5 === 0) return 'apple';
  return num;
}

module.exports = { myFunction }; 