document.addEventListener('DOMContentLoaded', function() {
  // Retrieve and set the stored difficulty level
  chrome.storage.local.get(['difficulty'], function(result) {
      if (result.difficulty) {
          document.getElementById(result.difficulty).checked = true;
      }
  });

  // Attach event listeners to radio buttons
  document.getElementById('easy').addEventListener('click', () => setDifficulty('easy'));
  document.getElementById('medium').addEventListener('click', () => setDifficulty('medium'));
  document.getElementById('hard').addEventListener('click', () => setDifficulty('hard'));
  document.getElementById('extreme').addEventListener('click', () => setDifficulty('extreme'));
});

function setDifficulty(level) {
  chrome.storage.local.set({ 'difficulty': level }, function() {
      console.log('Difficulty set to ' + level);
  });
}
