// =================================================================
// DUCK - BACKGROUND.JS FOR DYNAMIC BACKGROUND STUFF
// CALLED FROM gameview.js AND game.js

export function set_background_glitch(gameScreen) {
  let bg_idx = `` + Math.floor(Math.random() * 8).toFixed(0);
  bg_idx = bg_idx.padStart(2, "0");
  
  // HACK - TEST SPECIFIC
  bg_idx = '05';  
  
  // TODO - FIX URL FOR LOCAL AND GITHUB
  const bg_url = `url("../gameplay/background/bg_${bg_idx}_glitch.gif")`;
  console.log(
    `[GAMEVIEW] MADE RAND BG[${bg_url}] FOR[${gameScreen}] ID[${gameScreen.id}]`
  );
  gameScreen.style.backgroundImage = bg_url;
}

export function set_background_win(gameScreen) {
  // JUST RENAME THE STYLE
  let bg_url_glitch = gameScreen.style.backgroundImage;
  let bg_url_won = bg_url_glitch.replace("_glitch.gif", "_won.png");

  console.log(`[GAMEVIEW] GLITCH BG[${bg_url_glitch}] MADE WIN[${bg_url_won}]`);
  gameScreen.style.backgroundImage = bg_url_won;
}
