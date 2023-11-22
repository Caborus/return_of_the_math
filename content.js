// Content script for the extension

function generateRandomProblem(difficulty) {
  const operators = ['+', '-', '*'];
  let problem = {
      expression: '',
      toString: function() {
          return this.expression;
      }
  };

  let numberOfOperands;
  if (difficulty === 'easy') {
      numberOfOperands = 2; // Easy: 2 operands, 1 operator
  } else if (difficulty === 'medium') {
      numberOfOperands = 3; // Medium: 3 operands, 2 operators
  } else if (difficulty === 'hard') {
      numberOfOperands = 4; // Hard: 4 operands, 3 operators
  } else if (difficulty === 'extreme') {
      numberOfOperands = 20; 
  }

  for (let i = 0; i < numberOfOperands; i++) {
      problem.expression += (Math.floor(Math.random() * 10) + 1).toString();
      if (i < numberOfOperands - 1) {
          problem.expression += ' ' + operators[Math.floor(Math.random() * operators.length)] + ' ';
      }
  }

  return problem;
}




// Function to calculate the answer of the math problem
function calculateAnswer(problem) {
  let tokens = problem.split(' ');

  // First, handle all multiplication
  while (tokens.includes('*')) {
      let index = tokens.indexOf('*');
      let product = parseInt(tokens[index - 1]) * parseInt(tokens[index + 1]);
      tokens.splice(index - 1, 3, product.toString());
  }

  // Then, handle addition and subtraction
  let result = parseInt(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
      let nextVal = parseInt(tokens[i + 1]);
      if (tokens[i] === '+') {
          result += nextVal;
      } else if (tokens[i] === '-') {
          result -= nextVal;
      }
  }

  return result;
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

function getDifficultyLevel() {
  return new Promise((resolve, reject) => {
      chrome.storage.local.get(['difficulty'], function(result) {
          resolve(result.difficulty || 'easy'); // Default to 'easy' if not set
      });
  });
}

// Add event listener to document
document.addEventListener('click', async function(event) {
  let target = event.target.closest('.game-item a'); //still need to make work with all games
  if (!target) return;

  event.preventDefault();

  // Retrieve the difficulty level from storage
  const difficulty = await getDifficultyLevel();

  const problem = generateRandomProblem(difficulty);
  console.log(calculateAnswer(problem.toString()))
  const { overlay, input, submitButton, errorMessage } = createMathProblemOverlay(problem);

  // Handle submission of answer
  submitButton.addEventListener('click', function() {
      if (parseInt(input.value, 10) === calculateAnswer(problem.toString())) {
          overlay.remove();
          window.location.href = target.href; // Redirect to the game
      } else {
        errorMessage.textContent = 'Incorrect answer. Try again.';
        input.value = ''; // Clear the input field
      }
  });
});
