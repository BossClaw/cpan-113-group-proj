// =================================================================
// DUCK - BACKGROUND.JS FOR DYNAMIC BACKGROUND STUFF
// CALLED FROM gameview.js AND game.js

export function set_background_glitch(_level, _gameScreen) {
	// WIP - USE LEVEL PROGRESSION TO 'UNLOCK BGS'
	// V2DO - ENSURE BG CYCLING, EG - STORE IN LOCAL STORAGE

	// RANDOM
	// let bg_idx = `` + Math.floor(Math.random() * 8).toFixed(0);

	// PROGRESSION
	let bg_idx = _level;

	// DIV BY 2, SO NEW BG EVERY 2 LEVELS
	// bg_idx = Math.floor(_level / 2);

	// MOD FOR THE AVAIL 0..7
	bg_idx %= 8;

	// MAKE THE STRING
	let bg_idx_str = String(bg_idx).padStart(2, '0');

	// HACK - TEST SPECIFIC
	//bg_idx_str = "00";

	// TODO - FIX URL FOR LOCAL AND GITHUB
	const bg_url = `url("gameplay/background/bg_${bg_idx_str}_glitch.gif")`;

	console.log(`[GAMEVIEW][BG] LEVEL(${_level}) bg_ids(${bg_idx}) MADE RAND BG[${bg_url}] `);
	_gameScreen.style.backgroundImage = bg_url;
}

export function set_background_win(_gameScreen) {
	// V2DO - DETERMINE IF NECESSARY DUE TO DARK BG OVERLAY

	// JUST RENAME THE STYLE
	let bg_url_glitch = _gameScreen.style.backgroundImage;
	let bg_url_win = bg_url_glitch.replace('_glitch.gif', '_win.png');

	console.log(`[GAMEVIEW][BG] GLITCH BG[${bg_url_glitch}] MADE WIN[${bg_url_win}]`);
	_gameScreen.style.backgroundImage = bg_url_win;
}
