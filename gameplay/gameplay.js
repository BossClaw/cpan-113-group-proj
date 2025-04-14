import { startNewGame } from './game/game.js';
import { gameAudio } from './game-audio/gameAudio.js';
import { get_difficulty, get_languages, get_level } from '../game_settings.js';

// =========================================================================================
// Initialization function

export async function initializeGameLogic(gameInstance) {
	console.log(`[GAMEPLAY][INITIALIZEGAMELOGIC] INIT LOGIC FOR GAME INSTANCE[${gameInstance}]`);

	// Check local storage for picked languages
	let pickedLanguages = get_languages();

	// GET LIST OF ALL LANGUAGES & ALL WORDS from words.json
	async function importWords() {
		try {
			const response = await fetch('./gameplay/words.json');
			const data = await response.json();
			return data.words;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
	const wordList = await importWords();

	// ENSURE AT LEAST ONE VALID LANGUAGE IS PICKED
	let has_valid_lang_list = false;

	// GET ARR OF LANG KEYS
	let allowedLanguages = Object.keys(wordList);

	for (const language of pickedLanguages) {
		if (allowedLanguages.includes(language)) {
			has_valid_lang_list = true;
		}
	}

	if (!has_valid_lang_list) {
		console.log('[GAMEPLAY][INITGAME] NO VALID LANGUAGE FOUND IN SETTINGS');

		// CLEAR ALL
		localStorage.setItem('settings_languages', '[]');

		// REDIRECT
		window.location.href = 'index.html#mission_control';

		// RETURN TO AVOID ANY FUTHER PROC
		return;
	}


	// TODO - MAKE HUGE SHUFFLED LIST W/INDEX





	// INIT Variables for word-to-type
	let letterToTypeIndex = 0;
	let displayedWord = '';

	// GET REF TO WORD CONTAINER DOM EL
	const wordLetters = gameInstance.gameView.wordContainer;

	// Display word function
	function displayWord(word) {
		for (let char of word) {
			const span = document.createElement('span');
			span.textContent = char;
			wordLetters.appendChild(span);
		}
	}

	// Clear the word
	function clearWordDisplay() {
		wordLetters.innerHTML = '';
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
		const letterSpan = wordLetters.getElementsByTagName('span')[letterToTypeIndex];
		if (key === letterSpan.innerHTML) {
			letterSpan.style.color = 'green';
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

	document.addEventListener('keyup', (event) => {
		console.log(`[GAMEPLAY][KEYUP] GOT KEY[${event.key}]`);

		if (event.key === 'Enter' && !gameInstance.gameView.overlay && !gameInstance.isGame) {
			event.preventDefault();

			gameInstance.start();
			startingDisplay.style.visibility = 'hidden';
			clearWordDisplay();
			generateWord();
		} else if (event.key === 'Escape' && gameInstance.isGame) {
			togglePause();
		} else if (event.key === 'Shift') {
			return;
		} else if (gameInstance.isGame) {
			if (event.key == '=') {
				gameInstance.isDebugMode = !gameInstance.isDebugMode;
				console.log(`DEBUG NOW ${gameInstance.isDebugMode}`);
			} else {
				play_key_sound();
				attack(event.key);
			}
		}
		console.log(event);
	});

	// Stop scrolling with spacebar
	document.addEventListener('keydown', function (event) {
		if (event.code === 'Space') {
			event.preventDefault();
			console.log('YAYY');
			return;
		}
	});
}

// ======================================================================================
// KEY PRESS ANIM

// CACHE JUST THE KEY SPANS FOR FASTER LOOKUP
let key_span_dict;

function get_key_spans() {
	key_span_dict = {};

	document.querySelectorAll('.os_key').forEach((el) => {
		key_span_dict[el.id] = el;
	});

	// console.log(key_span_dict);
}

function add_keyboard_presskey_active() {
	document.addEventListener('keydown', (event) => {
		// GET AND THEN CHECK FOR WIP DEBUGGING AND PREVENTING CONSOLE ERROR SPAM IN PROD

		//const el = key_span_arr.getElementById(event.code);
		const el = key_span_dict[event.code];

		if (el) {
			el.classList.add('active');
		} else {
			console.log(`[GAME][KEYBOARD] NO ELEMENT FOUND FOR [${event.code}]`);
		}
	});

	document.addEventListener('keyup', (event) => {
		// GET AND THEN CHECK FOR WIP DEBUGGING AND PREVENTING CONSOLE ERROR SPAM IN PROD
		// const el = key_span_arr.getElementById(event.code);
		const el = key_span_dict[event.code];

		if (el) {
			el.classList.remove('active');
		} else {
			console.log(`[GAME][KEYBOARD] NO ELEMENT FOUND FOR [${event.code}]`);
		}
	});
}

// ==========================================================================
// HANDLER FOR KEY SOUND PLAYER FEEDBACK

function play_key_sound() {
	const key_idx = Math.floor(Math.random() * 10)
		.toString()
		.padStart(2, '0');
	const key_url = `gameplay/audio/keys/key_${key_idx}.wav`;

	console.log(`[GAMEPLAY][KEY] PLAY KEY SFX [${key_url}]`);

	gameAudio.play(key_url);
}

// ===================================================================
// CONST

const ignore_key_arr = ['Enter', 'Tab', 'Shift', 'Capslock'];

// =============================================================================================
// CREATE GAME ONLY WHEN DOM IS FINISHED LOADING

document.addEventListener('DOMContentLoaded', () => {
	console.log('[GAMEPLAY] DOM LOADED, CREATING GAME');

	// GET SPANS & INIT KEY
	get_key_spans();
	add_keyboard_presskey_active();

	// first game
	const gameScreen = document.querySelector('#game_screen');
	const level = get_level();
	const difficulty = get_difficulty();

	startNewGame(gameScreen, level, difficulty);
});
