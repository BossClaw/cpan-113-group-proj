import { get_languages, get_difficulty, get_level } from '../game_settings.js';
import { gameAudio } from '../gameplay/audio/gameAudio.js';

// ===================================================================================
// DUMP VALS ON SCRIPT START

console.log(`[MISSION][DIFFICULTY] [${get_difficulty()}]`);
console.log(`[MISSION][LANGUAGES] [${get_languages()}]`);
console.log(`[MISSION][LEVEL] [${get_level()}]`);

// ===================================================================================
// COLLECT UI ELEMENTS

// START GAME BUTTON
const startGame = document.getElementById('start_game_butt');

// GET LANGUAGE BUTTONS
const languageButtons = document.getElementsByClassName('language');
console.log(`[MISSIONCONFIGURE] GOT LANGUAGE BUTTS[${languageButtons.length}]`);

// =============================================================================
// SCORES
// TODO - MOVE THIS INTO THE game_settings TO BE FULLY ABSTRACTED FROM CALLING SCRIPT

const LOCAL_SCORES_KEY = 'local_scores';

export function add_new_high_score(_score, _initials, _language, _level, _difficulty) {
	//
	console.log('[SCORES] ADDING NEW HIGH SCORE');

	// 1 ) GET ALL THE SCORES AS SERIALIZED JSON STRING
	let score_str = localStorage.getItem(LOCAL_SCORES_KEY);

	// NULL CHECK
	if (!score_str) {
		score_str = '[]';
	}

	// DESERIALIZE TO ARRAY OF OBJECTS
	let score_arr = JSON.parse(score_str);

	// MAKE NEW SCORE OBJECT ARRAY
	let new_score_obj = {
		score: _score,
		initials: _inital,
		level: _level,
		difficulty: _difficulty,
	};

	// 2 ) ADD NEW SCORE OBJ TO ARRAY
	score_arr.push(new_score_obj);

	// 3 ) CREATE A NEW ORDERED ARRY BY SCORE / IN PLACE TBD
	score_arr.sort((a, b) => b.score - a.score);

	// 4 ) SLICE THE ARRAY FOR TOP 50
	score_arr.splice(50);

	// SERIALISE THE NEW ARRAY
	const new_score_arr_str = JSON.stringify(score_arr);

	// 5 ) RE-SET IT ON LOCAL STORAGE
	localStorage.setItem(LOCAL_SCORES_KEY, new_score_arr_str);

	// TBD - MAYBE WE'LL DO IT ALL BY LAUNGE

	// ENJOY BROCCOLI
}

// ===================================================================================
// LANGUAGE

// Inital Language settings from local storage
let pickedLanguages = get_languages();
console.log(`[UI][LANGUAGES] LANG PICKED (${pickedLanguages.length}) [${pickedLanguages}]`);
console.log(`[UI][LANGUAGES] LANG BUTT (${languageButtons.length}) [${languageButtons}]`);

Array.from(languageButtons).forEach((button) => {
	if (pickedLanguages.includes(button.innerHTML)) {
		button.classList.add('active-language');
	} else {
		button.classList.remove('active-language');
	}
});

// Add event listener to each Language button
Array.from(languageButtons).forEach((button) => {
	button.addEventListener('click', function (event) {
		console.log(`[MISSIONCONFINGURE] CLICKED LANGUAGE BUTTON[${event.target}]`);
		// CALL METHODS
		toggleActive(event.target);
		toggleAddToList(event.target);
		// DUMP UPDATED LIST
		console.log(`[MISSIONCONFIGURE] UPDATED PICKED LANG LIST[${pickedLanguages}]`);
	});
});

// Add / Remove language and CSS
function toggleActive(button) {
	const animate_class_name = 'animate__bounce';

	if (button.classList.contains('active-language')) {
		button.classList.remove('active-language');
		button.classList.remove('animate__animated');
		button.classList.remove(animate_class_name);
		gameAudio.playUiUnset();
	} else {
		button.classList.add('active-language');
		button.classList.add('animate__animated');
		button.classList.add(animate_class_name);
		gameAudio.playUiSet();
	}
}

function toggleAddToList(button) {
	let selected = button.innerHTML;
	if (pickedLanguages.includes(selected)) {
		let index = pickedLanguages.indexOf(selected);
		pickedLanguages.splice(index, 1);
	} else {
		pickedLanguages.push(selected);
	}
	localStorage.setItem('settings_languages', JSON.stringify(pickedLanguages));
	updateDisableStart();
}

function isPickedLanguage() {
	if (get_languages().length != 0) {
		return true;
	} else {
		return false;
	}
}

// =============================================================================
// DIFFICULTY SLIDER

// Temporary Difficulty Slider CSS
const difficultyDisplay = document.getElementById('difficulty-display');
const difficultySlider = document.getElementById('difficulty');

const difficultyValues = {
	1: 'easy',
	2: 'normal',
	3: 'hard',
	4: 'hardcore',
};

// Get difficulty value from input DOM and set it
difficultySlider.addEventListener('input', function () {
	let value = difficultyValues[this.value];
	difficultyDisplay.textContent = value;
	pickedDifficulty = value;
	gameAudio.playUiSet();
});

// Initial difficulty display
let initalDifficulty = Object.keys(difficultyValues).find((key) => difficultyValues[key] === get_difficulty());

console.log(`[UI][DIFFICULTY] inital dif(${initalDifficulty})`);
difficultySlider.value = initalDifficulty;
difficultyDisplay.textContent = get_difficulty();

// Initial picked difficulty
let pickedDifficulty = difficultyValues[difficultySlider.value];

// ================================================================================================
// LEVEL SLIDER

let last_slider_play = 0;

// Temporary Level Slider Css
const levelDisplay = document.getElementById('level-display');
const levelSlider = document.getElementById('level');

// Get level value
levelSlider.addEventListener('input', function () {
	levelDisplay.textContent = this.value;
	pickedLevel = this.value;
	console.log(`[UI][LEVEL] PICKED LEVEL(${pickedLevel})`);

	// TIME CHECK TO AVOID STACKING
	if (Date.now() - last_slider_play > 100) {
		gameAudio.playUiSet();
		last_slider_play = Date.now();
	}
});

// Initial level display
levelSlider.value = get_level();

levelDisplay.textContent = levelSlider.value;

// Initial picked level
let pickedLevel = levelSlider.value;

console.log(`[UI][LEVEL] INITIAL LEVEL(${pickedLevel})`);

// ============================================================================================
// START GAME BUTTON LOGIC

function updateDisableStart() {
	if (isPickedLanguage()) {
		startGame.disabled = false;
		startGame.style.backgroundColor = '#3399aa';
	} else {
		startGame.disabled = true;
		startGame.style.backgroundColor = 'grey';
	}
}

// Save to local storage on startGame click
startGame.addEventListener('click', function () {
	console.log(`[MISSIONCONFIGURE] START GAME CLICKED`);

	if (pickedLanguages.length != 0) {
		// Languages Stored when selected
		// Difficulty
		localStorage.setItem('settings_difficulty', pickedDifficulty);
		// Level
		localStorage.setItem('settings_level', pickedLevel);

		// TODO
		gameAudio.playUiStartGame();

		// ADD ANIM
		startGame.classList.add('animate__animated', 'animate__heartBeat', 'animate__faster');

		// WAIT A BIT AND THEN REDIR TO GAME PAGE
		setTimeout(() => {
			// REDIRECT
			window.location.href = 'gameplay.html';
		}, 700);
	} else {
		// SHOW MESG
		// alert("Please pick your languages");
		const dialog_lang = document.querySelector('#dialog_lang');
		dialog_lang.showModal();
	}
});

// ============================================================================================
// INIT THE PAGE

// Initial check disable start button
updateDisableStart();
