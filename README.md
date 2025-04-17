# Using Test-Driven Development to Get Better AI-Generated Code
![image](https://github.com/user-attachments/assets/d2ec7dbc-288b-4d81-8db4-0d853f9f3793)


This is not a vibe coding tutorial. But most developers agree that AI writes better code when you give it clear instructions. Well written tests naturally include these clear details about what the code should do.

This got me thinking — maybe test-driven development is actually a more reasonable way to use AI for coding? I decided to try it myself and see how it worked.

## TDD Basics

You don’t need to master TDD to understand the next steps. Just understand the basic cycle: write a failing test (Red), make it pass (Green), then improve the code (Refactor). That’s enough to start. You can read more about it on:

[Red, Green, Refactor: An introduction to TDD - Medium](https://medium.com/enfuse-io/red-green-refactor-an-introduction-to-tdd-d71a7eca0645)

## Environment

We’ll write our code in JavaScript, but the principles apply to any language. We’re using Cursor AI as our editor, but other tools like Windsurf should give similar results.

## Exercise 1

Let’s begin with a simple Fizz Buzz. I set up a minimal Node.js app with vanilla JavaScript and added Jest for testing. I wrote some tests — but intentionally avoided using the words ‘Fizz’ or ‘Buzz’ anywhere.

```javascript
const { myFunction } = require('./index');

describe('myFunction', () => {
    it('should return the number itself', () => {
        const result = myFunction(49);
        expect(result).toBe(49);
    });
    it('should return pine on multiples of 3', () => {
        const result = myFunction(9);
        expect(result).toBe('pine');
    });
    it('should return apple on multiples of 5', () => {
        const result = myFunction(10);
        expect(result).toBe('apple');
    });
    it('should return pineapple on multiples of 15', () => {
        const result = myFunction(15);
        expect(result).toBe('pineapple');
    });
});
```

Then I gave a very simple prompt:

> *On exercise-1 folder update index.js based on the tests*

The result: 

```javascript
export function myFunction (num) {
  if (num % 15 === 0) return 'pineapple';
  if (num % 3 === 0) return 'pine';
  if (num % 5 === 0) return 'apple';
  return num;
}
```
![image](https://github.com/user-attachments/assets/8a490d1c-1de7-4445-85c6-c3a36363b780)


Now we can add tests for features we did not implement yet.
```javascript
    it('should greet on string input', () => {
        const result = myFunction('Joe');
        expect(result).toBe('Hello Joe');
    });
    it('should return the number itself on strings that contains a number', () => {
        const result = myFunction('forty-nine');
        expect(result).toBe(49);
    });
    it('should return the number itself on strings that contains a number with space and case insensitive', () => {
        const result = myFunction('Forty nine');
        expect(result).toBe(49);
    });
    it('should return pine on strings that contains numbers multiples of 3', () => {
        const result = myFunction('Nine');
        expect(result).toBe('pine');
    });
    it('should return apple on strings that contains numbers multiples of 5', () => {
        const result = myFunction('ten');
        expect(result).toBe('apple');
    });
    it('should return pine on strings that contains numbers multiples of 15', () => {
        const result = myFunction('fifteen');
        expect(result).toBe('pineapple');
    });
````

Again I prompted the AI to update the `index.js`. But the new code was converting the strings to numbers with a limited hardcoded object:

```javascript
   const numberWords = {
     'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
     'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
     'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
     'forty-nine': 49, 'forty nine': 49
   };
```

To improve the code I asked:

> Using the numberWords object is not a good way to convert. Would a third-party lib make a better job converting the string into numbers?

The agent installed the [words-to-numbers](https://www.npmjs.com/package/words-to-numbers) package resulting in the following `index.js`:

```javascript
const wordsToNumbers = require('words-to-numbers').wordsToNumbers;

function myFunction(input) {
 // If input is a string
 if (typeof input === 'string') {
   // Try to convert string to number using the library
   const possibleNumber = wordsToNumbers(input);
  
   // If conversion was successful and result is a number
   if (typeof possibleNumber === 'number') {
     // Apply the same logic as numbers
     if (possibleNumber % 15 === 0) return 'pineapple';
     if (possibleNumber % 3 === 0) return 'pine';
     if (possibleNumber % 5 === 0) return 'apple';
     return possibleNumber;
   }
  
   // If not a number word, return greeting
   return `Hello ${input}`;
 }
  // If input is a number, apply the original logic
 if (input % 15 === 0) return 'pineapple';
 if (input % 3 === 0) return 'pine';
 if (input % 5 === 0) return 'apple';
 return input;
}
```

Code was working, but it could be improved. The Fizz Buzz logic was duplicated. Something satisfying to work with tests, is that I can ask AI for refactors on `index.js` knowing that any broken feature would be caught by `index.test.js` on terminal.

I asked a final prompt:

> Extracting the numbers logic into a separate function would improve code readability and maintainability.

```javascript
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
```

All tests passed:

![All tests passed](https://miro.medium.com/v2/resize:fit:700/0*fT1qPo2tT2bsHDtB)

## Exercise 2

Fizz Buzz was easy to test. I wanted to see if the same approach would work in a real-world scenario. So I applied the same testing principles to a React application, this time including an HTTP request.

I used [create-react-app](https://create-react-app.dev/) and removed the boilerplate to start a blank application. The goal is to search a user with [https://api.github.com/users/](https://api.github.com/users/) and present the result.

I added tests to [App.test.js](https://gist.github.com/andregardi/8868484f96a8b80bb952ef85b5f38e6a) that cover the following:

- Signals that “Github search” is readable from begin.
- Mocks `fetch`.
- Reads User Name from an input.
- Clicks on the search button.
- Requests the API with the User Name as parameter.
- Reads “Loading…”.
- Handles both success and failure scenarios.

Then I prompted:

> Based on App.test.js update App.js as a React clean code expert.

This was the resulting [App.js](https://gist.github.com/andregardi/76622ace6edfc14422be3c708ae9d9bf). Being honest, I did not expect it to work on the first try. But that is the result I got out of the box:

![App Result](https://miro.medium.com/v2/resize:fit:640/format:webp/1*YhkgsCKVO2XkdzJEvAX-EQ.gif)

The component’s logic works perfectly, but styling isn’t easily testable in unit tests. I decided to try asking the AI to improve the style and make it look like the actual Github page.

**Prompt Engineering Tip:** Before using a prompt, ask AI to refine it for better results.

**Before:**

> You are a great designer. Make this look great! Using @https://github.com/ aesthetics is welcome. But keep it minimal. Centralize and space elements, meaning to fill more of the screen. Replacing the Loading text with a loading icon is welcome.

**After:**

> Transform this component into a visually polished design while preserving its core functionality. Key requirements:
>
> 1. Aesthetic Approach:
>    - Adopt GitHub’s clean, minimal design language (@https://github.com/)
>    - Maintain functional simplicity while elevating visual appeal
>
> 2. Layout Principles:
>    - Center all elements vertically and horizontally
>    - Maximize screen real estate usage with balanced spacing
>
> 3. Create clear visual hierarchy
>    - Specific Enhancements:
>      - Replace “Loading…” text with a subtle animated spinner/icon
>      - Use GitHub-inspired typography and color palette
>      - Implement smooth state transitions
>
> 4. Constraints:
>    - Don’t alter the core data-fetching logic
>    - Keep the component structure fundamentally the same
>    - Maintain all existing functionality
>
> The result should feel like a native GitHub UI element — professional, understated, and highly functional.

The result was actually very good:

![Styled Result](https://miro.medium.com/v2/resize:fit:700/1*XVdQmlNK1upkLca8JS4s0Q.gif)

## GitHub Repository

Code for both exercises is available on GitHub. Check the individual commits if you want to compare code between each step applied.

[GitHub - andregardi/tdd-ai: Using Test-Driven Development to Get Better AI-Generated Code](https://github.com/andregardi/tdd-ai?source=post_page-----ebcc7f7fd107---------------------------------------)
