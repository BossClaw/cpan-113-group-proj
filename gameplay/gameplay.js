import { startNewGame } from './game.js';
import { gameAudio } from './audio/gameAudio.js';
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
			const response = await fetch('./gameplay/words/words.json');
			const data = await response.json();
			console.log('[GAMEPLAY][INIT] WORD DATA LOAD STAGE 2/3');
			return data.words;
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	// GET WORD LIST
	console.log('[GAMEPLAY][INIT] WORD DATA LOAD STAGE 1/3');
	const wordList = await importWords();
	console.log('[GAMEPLAY][INIT] WORD DATA LOAD STAGE 3/3');

	// GET LANG ARR & WORDLIST
	const lang_key_arr = Object.keys(wordList);
	console.log(`[GAMEPLAY][INITIALIZEGAMELOGIC] GOT WORD LISTS(${lang_key_arr.length}) KEYS[${lang_key_arr}]`);
	// console.log(wordList);

	// BUILD PICKED WORDS
	// AND ENSURE AT LEAST ONE VALID LANGUAGE IS PICKED
	let picked_words = [];
	let has_valid_lang_list = false;

	for (const language of pickedLanguages) {
		console.log(`[GAMEPLAY][INITIALIZEGAMELOGIC] EVAL PICKED LANG[${language}]`);

		if (lang_key_arr.includes(language)) {
			has_valid_lang_list = true;

			var lang_words = wordList[language];
			picked_words = [...picked_words, ...lang_words];

			// STRIP OUT TOO LONG WORDS
			// V2DO - LIST THE WORDS
			let prev_count = picked_words.length
			picked_words = picked_words.filter((word) => word.length < 30);

			console.log(`[GAMEPLAY][INITIALIZEGAMELOGIC] GOT LANG[${language}] WORDS(${lang_words.length}) CUR PICKED WORD LEN(${picked_words.length}) REMOVED(${(prev_count - picked_words.length)})`);
		}
	}

	if (!has_valid_lang_list) {
		console.log('[GAMEPLAY][INITGAME] NO VALID LANGUAGE FOUND IN SETTINGS');

		// CLEAR ALL
		localStorage.setItem('settings_languages', '[]');

		// REDIRECT
		// window.location.href = 'index.html#mission_control';

		// RETURN TO AVOID ANY FUTHER PROC
		return;
	}

	// RESET SHUFF VARS
	let shuff_word_idx = 1;
	let shuff_words = [];

	function pick_new_word() {
		if (shuff_word_idx >= shuff_words.length) {
			// RE-CREATE IT
			shuff_words = [...picked_words];

			console.log(`[GAMEPLAY][WORD] SHUFF_IDX(${shuff_word_idx}) SHUFFLING WORDS(${shuff_words.length})`);

			// Shuffle using Fisher-Yates algorithm
			for (let i = shuff_words.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuff_words[i], shuff_words[j]] = [shuff_words[j], shuff_words[i]];
				// Reset index
				shuff_word_idx = 0;
			}
		}

		// GET NEXT WORD
		var ret_word = shuff_words[shuff_word_idx];

		console.log(`[GAMEPLAY][WORD] PICK_WORD RETURNING WORD[${ret_word}]`);

		// INC IDX FOR NEXT PICK
		shuff_word_idx++;

		return ret_word;
	}

	// INIT Variables for word-to-type
	let displayedWord = pick_new_word();
	let letterToTypeIndex = 0;

	console.log(`[GAMEPLAY][WORD] INIT DISPLAYEDWORD[${displayedWord}]`);

	// GET REF TO WORD CONTAINER DOM EL
	const wordLetters = gameInstance.gameView.wordContainer;

	// Display word function
	function displayWord(word) {
		console.log(`[GAMEPLAY][WORD] DISPLAYING WORD[${word}]`);

		let word_str = '' + word;

		for (let char of word_str) {
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
		displayedWord = pick_new_word();
		displayWord(displayedWord);
	}

	// Typing attack
	function attack(key) {
		// console.log(`[GAMEPLAY][ATTACK] WITH KEY[${key}]`);

		// V2DO - STORE AS ARRAY INSTEAD OF DOING A DOM LOOKING
		const letterSpan = wordLetters.getElementsByTagName('span')[letterToTypeIndex];

		// HANDLE IF CORRECT
		// V2DO - TESTING OUT CASE INSENSITIVE
		// if (key === letterSpan.innerHTML) {
		if (key.toLowerCase() === letterSpan.innerHTML.toLowerCase()) {
			letterSpan.style.color = 'cyan';
			letterToTypeIndex += 1;
			gameInstance.onPlayerAttack();

			// CHECK FOR COMPLETION
			if (letterToTypeIndex === displayedWord.length) {
				clearWordDisplay();
				generateWord();
			}
		} else {
			gameInstance.onPlayerAttack(false);
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
		// console.log(`[GAMEPLAY][KEYUP] GOT KEY[${event.key}]`);

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
		} else {
			console.log(`[GAMEPLAY][KEYUP] UNHANDLED KEYUP[${event.key}]`);
		}
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
			// console.log(`[GAME][KEYBOARD] NO ELEMENT FOUND FOR [${event.code}]`);
		}
	});

	document.addEventListener('keyup', (event) => {
		// GET AND THEN CHECK FOR WIP DEBUGGING AND PREVENTING CONSOLE ERROR SPAM IN PROD
		// const el = key_span_arr.getElementById(event.code);
		const el = key_span_dict[event.code];

		if (el) {
			el.classList.remove('active');
		} else {
			// console.log(`[GAME][KEYBOARD] NO ELEMENT FOUND FOR [${event.code}]`);
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

	// console.log(`[GAMEPLAY][KEY] PLAY KEY SFX [${key_url}]`);

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

function RandInt(int_max) {
	return Math.floor(Math.random() * int_max);
}
