// Content script for the extension

// Function to generate a random math problem
function generateRandomProblem() {
  const operand1 = Math.floor(Math.random() * 10) + 1;
  const operand2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  return {
      operand1: operand1,
      operand2: operand2,
      operator: operator,
      toString: function() {
          return `${operand1} ${operator} ${operand2}`;
      }
  };
}

// Function to calculate the answer of the math problem
function calculateAnswer(problem) {
  switch (problem.operator) {
      case '+':
          return problem.operand1 + problem.operand2;
      case '-':
          return problem.operand1 - problem.operand2;
      case '*':
          return problem.operand1 * problem.operand2;
      default:
          return NaN; // Handle unsupported operators
  }
}

// Function to create the math problem overlay
function createMathProblemOverlay(problem) {
  const overlay = document.createElement('div');
  overlay.id = 'mathProblemOverlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.zIndex = '1000';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  
  const container = document.createElement('div');
  container.style.padding = '20px';
  container.style.backgroundColor = 'black';
  container.style.borderRadius = '5px';

  const mathProblem = document.createElement('p');
  mathProblem.textContent = `Solve: ${problem.toString()}`;
  container.appendChild(mathProblem);

  const input = document.createElement('input');
  input.type = 'text';
  container.appendChild(input);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit Answer';
  container.appendChild(submitButton);

  const errorMessage = document.createElement('p');
  errorMessage.style.color = 'red';
  errorMessage.textContent = '';
  container.appendChild(errorMessage);


  // Adding an event listener to close the overlay if clicked outside the popup container
  overlay.addEventListener('click', function(event) {
    if (event.target === overlay) {
        overlay.remove(); // Remove the overlay if the click is directly on the overlay
    }
});

// Prevent clicks inside the container from closing the overlay
container.addEventListener('click', function(event) {
    event.stopPropagation();
});

  overlay.appendChild(container);
  document.body.appendChild(overlay);

  return { overlay, input, submitButton, errorMessage };
}

// Add event listener to document
document.addEventListener('click', function(event) {
  let target = event.target.closest('.game-item a');
  if (!target) return;

  event.preventDefault();

  const problem = generateRandomProblem();
  const { overlay, input, submitButton, errorMessage } = createMathProblemOverlay(problem);

  // Handle submission of answer
  submitButton.addEventListener('click', function() {
      if (parseInt(input.value, 10) === calculateAnswer(problem)) {
          overlay.remove();
          window.location.href = target.href; // Redirect to the game
      } else {
        errorMessage.textContent = 'Incorrect answer. Try again.';
        input.value = ''; // Clear the input field
      }
  });
});
