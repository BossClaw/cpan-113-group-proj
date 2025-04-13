// =================================================================
// DUCK - BACKGROUND.JS FOR DYNAMIC BACKGROUND STUFF
// CALLED FROM gameview.js AND game.js

export function set_background_glitch(_level, _gameScreen) {
  // V2DO - USE LEVEL TO 'UNLOCK BGS'

  // TODO - ENSURE BG CYCLING, EG - STORE IN LOCAL STORAGE

  let bg_idx = `` + Math.floor(Math.random() * 8).toFixed(0);
  bg_idx = bg_idx.padStart(2, "0");

  // HACK - TEST SPECIFIC
  // bg_idx = "05";

  // TODO - FIX URL FOR LOCAL AND GITHUB
  const bg_url = `url("../gameplay/background/bg_${bg_idx}_glitch.gif")`;
  console.log(
    `[GAMEVIEW][BG] MADE RAND BG[${bg_url}] FOR[${_gameScreen}] ID[${_gameScreen.id}]`
  );
  _gameScreen.style.backgroundImage = bg_url;
}

export function set_background_win(_gameScreen) {
  // V2DO - DETERMINE IF NECESSARY DUE TO DARK BG OVERLAY

  // JUST RENAME THE STYLE
  let bg_url_glitch = _gameScreen.style.backgroundImage;
  let bg_url_won = bg_url_glitch.replace("_glitch.gif", "_won.png");

  console.log(`[GAMEVIEW][BG] GLITCH BG[${bg_url_glitch}] MADE WIN[${bg_url_won}]`);
  _gameScreen.style.backgroundImage = bg_url_won;
}
