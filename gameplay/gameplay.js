import { startNewGame } from "./game/game.js";
import { gameAudio } from "./game-audio/gameAudio.js";

document.addEventListener("DOMContentLoaded", () => {
  // first game
  const gameScreen = document.querySelector("#game_screen");
  const level = localStorage.getItem("level") || "1";
  const difficulty = localStorage.getItem("difficulty") || "normal";
  startNewGame(gameScreen, level, difficulty);
});

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
    const randomLang =
      pickedLanguages[Math.floor(Math.random() * pickedLanguages.length)];
    const languageWords = wordList[randomLang];
    displayedWord =
      languageWords[Math.floor(Math.random() * languageWords.length)];
    displayWord(displayedWord);
  }

  // Typing attack
  function attack(key) {
    const letterSpan =
      wordLetters.getElementsByTagName("span")[letterToTypeIndex];
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
  const startingDisplay = gameInstance.gameView.startingDisplay;
  document.addEventListener("keyup", (event) => {
    if (
      event.key === "Enter" &&
      !gameInstance.gameView.overlay &&
      !gameInstance.isGame
    ) {
      event.preventDefault();
      gameInstance.start();
      startingDisplay.style.visibility = "hidden";
      clearWordDisplay();
      generateWord();
    } else if (event.key === "Escape" && gameInstance.isGame) {
      togglePause();
    } else if (event.key === "Shift") {
      return;
    } else if (gameInstance.isGame) {
      play_key_sound();
      attack(event.key);
    }
  });
}

// ==========================================================================
// HANDLER FOR KEY SOUND PLAYER FEEDBACK

function play_key_sound() {
  const key_idx = Math.floor(Math.random() * 10).toString().padStart(2, "0");
  const key_url = `gameplay/audio/keys/key_${key_idx}.wav`;

  console.log(`[GAMEPLAY][KEY] PLAY KEY SFX [${key_url}]`);

  gameAudio.play(key_url);
}
