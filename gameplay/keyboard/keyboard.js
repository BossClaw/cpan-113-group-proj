// this is a temp gameplay.js 

// Initialization function
export async function initializeGameLogic(gameInstance) {

  // Variables for word-to-type
  let letterToTypeIndex = 0;
  let displayedWord = "";
  const wordLetters = gameInstance.gameView.wordContainer;

  // Variables for game settings
  let pickedLanguages = [];


  // Check local storage
  pickedLanguages = JSON.parse(localStorage.getItem("pickedLanguages"));


  // Import words.json
  async function importWords() {
    try {
      const response = await fetch("./gameplay/words.json");
      const data = await response.json();
      return data.words;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  const wordList = await importWords();

  // Display word function
  function displayWord(word) {
    for (let char of word) {
      const span = document.createElement("span");
      span.textContent = char;
      wordLetters.appendChild(span);
    }
  }

  // Clear the word
  function clearWordDisplay() {
    wordLetters.innerHTML = "";
    letterToTypeIndex = 0;
  }

  // Generate new word
  function generateWord() {
    const randomLang = pickedLanguages[Math.floor(Math.random() * pickedLanguages.length)];
    const languageWords = wordList[randomLang];
    displayedWord = languageWords[Math.floor(Math.random() * languageWords.length)];
    displayWord(displayedWord);
  }

  // Typing attack
  function attack(key) {
    const letterSpan = wordLetters.getElementsByTagName("span")[letterToTypeIndex];
    if (key === letterSpan.innerHTML) {
      letterSpan.style.color = "green";
      letterToTypeIndex += 1;
      gameInstance.onPlayerAttack();
    } else {
      gameInstance.onPlayerAttack(false);
    }
    checkForCompletion();
  }

  // Check if word is complete
  function checkForCompletion() {
    if (letterToTypeIndex === displayedWord.length) {
      clearWordDisplay();
      generateWord();
    }
  }

  // Pause toggle
  function togglePause() {
    if (gameInstance.isPaused) {
      gameInstance.resume();
    } else {
      gameInstance.pause();
    }
  }

  // Key listener
  const startingDisplay = gameInstance.gameView.startingDisplay
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !gameInstance.gameView.overlay) {
      event.preventDefault();
      gameInstance.start();
      startingDisplay.style.visibility = "hidden";
      clearWordDisplay();
      generateWord();
    } else if (event.key === "Escape" && gameInstance.isGame) {
      togglePause();
    } else if (gameInstance.isGame) {
      attack(event.key);
    }
  });
}

