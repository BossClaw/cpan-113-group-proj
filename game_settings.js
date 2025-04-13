// =================================================================================
// LANGUAGES SET / GET

const KEY_LANGUAGES = 'settings_languages';

export function get_languages() {
	var local_languages_str = localStorage.getItem(KEY_LANGUAGES);
	if (!local_languages_str) {
		return [];
	}

	// PARSE
	return JSON.parse(local_languages_str);
}

export function set_languages(lang_arr) {
	// V2DO - MOVE MISSION CONFIGURE CODE TO HERE
	//var local_languages_str = localStorage.getItem(KEY_LANGUAGES);
	// if (!local_languages_str) {
	//   return [];
	// }
	// LOG & SET IT
	// V2DO - STORE ON DB OR SET FLAG THAT 'DB STORE REQUIRED'
	//console.log(`[DATA][LEVEL] SET NEW LEVEL_UNLOCKED(${intLevel})`);
}

// =================================================================================
// LEVEL SET / GET

const KEY_LEVEL = 'settings_level';

export function get_level(_level = 1) {
	var local_level = localStorage.getItem(KEY_LEVEL);
	if (local_level) {
		return local_level;
	}
	return _level;
}

export function set_level(_level) {
	// ENSURE IS NUMBER AND VALID RANGE
	const intLevel = parseInt(_level);
	if (intLevel < 0) {
		console.log(`[DATA][${KEY_LEVEL}] SET (${intLevel}) VALUE TOO SMALL`);
		return;
	}

	if (intLevel > 100) {
		if (intLevel != 666) {
			console.log(`[DATA][${KEY_LEVEL}] SET (${intLevel}) VALUE TOO HIGH`);
			return;
		}
	}

	// LOG & SET IT
	// V2DO - STORE ON DB OR SET FLAG THAT 'DB STORE REQUIRED'
	console.log(`[DATA][${KEY_LEVEL}] SET (${intLevel})`);
	localStorage.setItem(KEY_LEVEL, intLevel);
}

// =================================================================================
// LEVEL_UNLOCKED SET/GET

const KEY_LEVEL_UNLOCKED = 'settings_level_unlocked';

export function get_level_unlocked(_level = 1) {
	var local_level_unlocked = localStorage.getItem(KEY_LEVEL_UNLOCKED);
	if (local_level_unlocked) {
		return local_level_unlocked;
	}
	return _level;
}

export function settings_level_unlocked(_level) {
	// ENSURE IS NUMBER AND VALID RANGE
	const intLevel = parseInt(_level);
	if (intLevel < 0) {
		console.log(`[DATA][${KEY_LEVEL_UNLOCKED}] SET(${intLevel}) TOO SMALL`);
		return;
	}

	// GET CUR UNLOCKED
	const cur_unlocked = get_level_unlocked();

	// ABORT IF LOWER OR SAME AS CUR
	if (intLevel <= cur_unlocked) {
		console.log(`[DATA][${KEY_LEVEL_UNLOCKED}] SET(${intLevel}) SAME OR LOWER THAN cur_unlocked (${cur_unlocked})`);
		return;
	}

	// LOG & SET IT
	console.log(`[DATA][${KEY_LEVEL_UNLOCKED}] SET (${intLevel})`);
	localStorage.setItem(KEY_LEVEL_UNLOCKED, intLevel);
}

// ======================================================================
// SET/GET DIFFICULTY

const KEY_DIFFICULTY = 'settings_difficulty';

export function get_difficulty() {
	var local_difficulty = localStorage.getItem(KEY_DIFFICULTY);
	if (local_difficulty) {
		return local_difficulty;
	}
	return 'easy';
}

export function set_difficulty(_difficulty) {
	// ENSURE IS NUMBER AND VALID RANGE
	const intDifficulty = parseInt(_difficulty);

	if (intDifficulty < 0) {
		console.log(`[DATA][DIFFICULTY] SET PASSED TOO SMALL OF VALUE (${intDifficulty})`);
		return;
	}

	if (intDifficulty > 3) {
		console.log(`[DATA][DIFFICULTY] SET PASSED TOO HIGH OF VALUE (${intDifficulty})`);
		return;
	}

	// LOG & SET IT
	// V2DO - STORE ON DB OR SET FLAG THAT 'DB STORE REQUIRED'
	console.log(`[DATA][DIFFICULTY] SET NEW(${intDifficulty})`);
	localStorage.setItem(KEY_DIFFICULTY, intDifficulty);
}

// ======================================================================
// SET/GET INITALS

const KEY_INITIALS = 'settings_initials';

export function get_intials() {
	var local_initials = localStorage.getItem(KEY_INITIALS);
	if (local_initials) {
		return local_initials;
	}
	return 'AAA';
}

export function set_intials(_initials) {
	if (!initials || initials.length != 3) {
		return;
	}

	// LOG & SET IT
	// V2DO - STORE ON DB OR SET FLAG THAT 'DB STORE REQUIRED'
	console.log(`[DATA][${KEY_INITIALS}] SET NEW(${_initials})`);
	localStorage.setItem(KEY_INITIALS, _initials);
}
