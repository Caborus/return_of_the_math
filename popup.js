// Popup script
 
// This listens for a message from background.js for generating random math problems
document.addEventListener('DOMContentLoaded', function () {
  let currentProblem;

  function generateRandomProblem() {
    const operand1 = Math.floor(Math.random() * 10) + 1;
    const operand2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
  
    currentProblem = {
      operand1: operand1,
      operand2: operand2,
      operator: operator,
    };

    document.getElementById('mathProblem').innerText = `Solve: ${operand1} ${operator} ${operand2}`;
  }

  // Computers should do math too.
  function calculateAnswer() {
    const operand1 = currentProblem.operand1;
    const operand2 = currentProblem.operand2;
    const operator = currentProblem.operator;

    switch (operator) {
      case '+':
        return operand1 + operand2;
      case '-':
        return operand1 - operand2;
      case '*':
        return operand1 * operand2;
      default:
        return NaN; // Handle unsupported operators
    }
  }

  chrome.runtime.getBackgroundPage(function (backgroundPage) {
    backgroundPage.postMessage({ action: 'proceedWithRedirect' });
  });

  // Listen for the submit button to be clicked and check the answer
  document.getElementById('submitAnswer').addEventListener('click', function () {
  const userAnswer = document.getElementById('userAnswer').value;
  if (calculateAnswer() === parseInt(userAnswer, 10)) {
    console.log('Answer is correct. Sending proceedWithRedirect message.');
    chrome.runtime.sendMessage({ action: 'proceedWithRedirect' });
  } else {
    alert('Incorrect answer. Try again!');
    generateRandomProblem();
  }
});


  // Generate a random math problem when the popup is opened
  generateRandomProblem();
});
