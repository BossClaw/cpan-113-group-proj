// COMMON JS TO EVERY PAGE IN THE PROJECT
// TBD - SPLIT .JS UP INTO FOCUSED FILES : backend.js, audio.js, video.js, etc...

import { dev_log_mesg } from "./dev.js";
import { viz_init_bg } from "./bg.js";
import { gameAudio } from "../gameplay/game-audio/gameAudio.js";

// =================================================================
// HANDLE THE LOGGED IN CHECK

function redirect_to_login() {
  // TODO

  // NO JWT IN STORAGE? REDIRECT

  // JWT NOT VALID AUT? REDIRECT

  // !!!! - BLOCKING DIV
  return false;
}

// =================================================================
// ATTACH UI

function ui_init_events() {
  console.log("[COMMON][PAGE][UI] INIT");

  // ADD CRT TOGGLE
  crt_target_dom = document.querySelector("body");
  crt_toggle_button = document.querySelector("#ui_crt_toggle");
  crt_toggle_button.addEventListener("click", () => {
    crt_toggle();
  });

  // ADD SHOW MODAL TO BUTTS
  // HACK, CHECKING IF NOT GAMEPLAY PAGE.  A MORE MODULAR, ELEGANT SOLUTION EXISTS
  if (!is_gameplay_page) {
    const butt_credits = document.querySelector("#butt_credits");
    const dialog_credits = document.querySelector("#dialog_credits");
    if (butt_credits && dialog_credits) {
      butt_credits.addEventListener("click", () => {
        dialog_credits.showModal();
      });
    }

    // ADD 'CLOSE PARENT' TO ALL DIALOGUES
    document.querySelectorAll(".butt_dialog").forEach((el) => {
      el.addEventListener("click", () => {
        // FIND PARENT DIALOG & CLOSE
        const parent_dialog = el.parentNode;
        console.log(`[COMMON][DIALOG] TRY CLOSING DIALOG[${parent_dialog.id}]`);
        parent_dialog.close();
      });
    });
  }
}

// =================================================================
// AUDIO WRAPPER
// TODO - EVAL AND USE OR REMOVE THIS COD

const AUD_VOLUME_KEY = "aud_volume";

function aud_get_volume() {
  var cur_volume = parseFloat(localStorage.getItem(AUD_VOLUME));
  console.log(`[COMMON][AUD] get_volume(${cur_volume})`);
  return cur_volume;
}

function aud_set_volume(volume_val) {
  console.log(`[COMMON][AUD] set_volume(${volume_val})`);
  localStorage.setItem(AUD_VOLUME, volume_val);

  update_aud_dom();
}

function update_aud_dom() {
  // UPDATE THE AUDIO DOM WITH MUTE / VOLUME VALS
}

// =================================================================
// AUD WRAPPER

function play_common_bg_music() {
  if (is_gameplay_page) {
    console.log("[COMMON][AUD] NO BG MUSIC ON GAMEPLAY PAGE");
    return;
  }

  console.log("[COMMON][AUD] PLAYING BG MUSIC");
  gameAudio.setConsent(true);
  gameAudio.play(
    "audio/music/Phat_Phrog_Studios_Retro_Fragments.mp3",
    true,
    true
  );
}

function aud_init() {
  console.log("[COMMON][PAGE][AUD] INIT");

  // COMMON PAGE BG MUSIC
  aud_update_dom();

  // ADD EVENT TO MUTE BUTTON
  var aud_mute = document.querySelector("#butt_aud_mute");

  if (!aud_mute) {
    console.error("[COMMON][AUD] CAN'T GET FIND 'butt_aud_mute'.");
    return;
  }

  aud_mute.addEventListener("click", () => {
    gameAudio.play_ui_set();
    aud_mute_toggle();
  });
}

const VIZ_AUD_MUTED_KEY = "aud_muted";

function aud_get_muted() {
  var cur_aud_val = localStorage.getItem(VIZ_AUD_MUTED_KEY) == "true";
  console.log(`[COMMON][AUD] get_muted(${cur_aud_val})`);
  return cur_aud_val;
}

function aud_set_muted(aud_muted) {
  // TODO - ALIGN ALL THESE VALUES PROPERLY
  console.log(`[COMMON][AUD] set_muted(${aud_muted})`);
  localStorage.setItem(VIZ_AUD_MUTED_KEY, aud_muted);

  // UPDATE THE CONSENT
  gameAudio.setConsent(true);

  // SET THE VALUE EXPLICITLY
  gameAudio.setMusicPaused(aud_muted);

  // PLAY NOISE
  // UPDATE THE ICON
  aud_update_dom();
}

function aud_mute_toggle() {
  console.log("[COMMON][AUD] TOGGLE MUTED CLICKED");

  // CALC INVERSE
  const mute_inverse = !aud_get_muted();
  console.log(
    `[COMMON][AUD] CUR(${aud_get_muted()}) TOGGLING TO(${mute_inverse})`
  );

  // STORE & APPLY INVERSE
  aud_set_muted(mute_inverse);
}

// UPDATE THE DOM BASED ON VAL
function aud_update_dom() {
  // GET THE BODY/DIV/DOM ELEMENT TARGET FOR CRT
  var target = document.querySelector("#butt_aud_mute");

  if (!target) {
    console.log(`[COMMON][AUD] NO DOM FOUND TO UPDATE`);
    return;
  }

  const aud_is_muted = aud_get_muted();

  console.log(
    `[COMMON][AUD] UPDATING DOM[${target.id}] MUTED(${aud_is_muted})`
  );

  // SET SPEAKER SPRITE BY CLASS
  if (aud_is_muted) {
    target.classList.add("aud_icon_muted");
    target.classList.remove("aud_icon_loud");
    gameAudio.setMusicPaused(true);
  } else {
    target.classList.remove("aud_icon_muted");
    target.classList.add("aud_icon_loud");

    gameAudio.setMusicPaused(false);
  }
}

// =================================================================
// VIZ WRAPPER

function viz_init() {
  console.log("[COMMON][PAGE][VIZ] INIT");

  viz_init_bg();

  crt_set_enabled(crt_get_enabled());
}

// =================================================================
// VIZ CRT

const VIZ_CRT_ENABLED_KEY = "viz_crt_enabled";

function crt_get_enabled() {
  // TRY GET VAL FROM STORAGE
  var cur_crt_val = localStorage.getItem(VIZ_CRT_ENABLED_KEY) == "true";
  console.log(`[COMMON][VIZ][CRT] get_enabled(${cur_crt_val})`);

  return cur_crt_val;
}

function crt_set_enabled(crt_enabled) {
  console.log(`[COMMON][VIZ][CRT] SETTING ENABLED(${crt_get_enabled()})`);
  localStorage.setItem(VIZ_CRT_ENABLED_KEY, crt_enabled);
  crt_update_dom();
}

let crt_target_dom;
let crt_toggle_button;

function crt_toggle() {
  console.log("[COMMON][VIZ][CRT] TOGGLE CLICKED");
  // CALC INVERSE
  const crt_inverse = !crt_get_enabled();
  console.log(
    `[COMMON][VIZ][CRT] CUR(${crt_get_enabled()}) TOGGLING TO(${crt_inverse})`
  );

  // STORE & APPLY INVERSE
  crt_set_enabled(crt_inverse);
}

// UPDATE THE DOM BASED ON VAL
function crt_update_dom() {
  // GET THE BODY/DIV/DOM ELEMENT TARGET FOR CRT
  const crt_is_enabled = crt_get_enabled();

  console.log(
    `[COMMON][VIZ][CRT] UPDATING DOM[${crt_target_dom}] ENABLED(${crt_is_enabled})`
  );

  if (crt_is_enabled) {
    crt_toggle_button.classList.add("viz_icon_fx_on");
    crt_toggle_button.classList.remove("viz_icon_fx_off");
    gameAudio.play_ui_set();
  } else {
    crt_toggle_button.classList.remove("viz_icon_fx_on");
    crt_toggle_button.classList.add("viz_icon_fx_off");
    gameAudio.play_ui_unset();
  }

  // ADD TO BODY
  if (crt_is_enabled) {
    crt_target_dom.classList.add("crt");
  } else {
    crt_target_dom.classList.remove("crt");
  }
}

// =======================================================================
// TBD - UI HELPERS SHOW/HIDE STUFF

// WAIT TILL DOM IS LOADED BEFORE CALLING
// GET THE PROJ BUTTONS, ADD LISTENERS
let view_ahref_arr;
let view_button_arr;
let view_info_arr;

function ui_helper_init() {
  // TBD - IS THIS ANY USE?
  document.addEventListener("DOMContentLoaded", () => {
    // CENTER COL
    const centerCol = document.querySelector(".center_col");

    // GET VIEW BUTT, AHREF & INFO ARRS
    view_info_arr = document.querySelectorAll(".view_info");
    console.log(`GOT INFOS(${view_info_arr.length})`);

    view_button_arr = document.querySelectorAll(".viewect_butt");
    console.log(`GOT BUTTONS(${view_button_arr.length})`);

    view_ahref_arr = document.querySelectorAll(".view_ahref");
    console.log(`GOT AHREFS(${view_ahref_arr.length})`);

    // ADD CLICK LOGIC TO BUTTONS
    view_button_arr.forEach((button) => {
      button.addEventListener("click", () => {
        const viewIndex = button.dataset.viewIndex;
        show_view(viewIndex);
      });
    });

    // ADD CLICK LOGIC TO AHREFS
    view_ahref_arr.forEach((ahref) => {
      ahref.addEventListener("click", () => {
        // GET THE VIEW TO SHOW
        const viewIndex = ahref.dataset.viewIndex;
        show_view(viewIndex);
      });
    });

    // MAKE SURE CTA IS VIS AND REST ARE HIDDEN ON PAGE LOAD
    show_view(0);
  });
}

function show_view(viewIndex) {
  // SIMPLE LOOP TO HIDE NOT WANTED, SHOW TARG
  // NOTE INCLUSIVE AT THE END BECAUSE 0 IS CTA

  let targ_div;

  for (let pi = 0; pi < view_button_arr.length + 1; pi++) {
    if (pi == viewIndex) {
      console.log("SHOWING " + pi);
      view_info_arr[pi].style.display = "flex";

      targ_div = view_info_arr[pi];
    } else {
      console.log("HIDING " + pi);
      view_info_arr[pi].style.display = "none";
    }
  }
}

// =======================================================================
// COMMON PAGE STUFF
let is_gameplay_page = false;

function common_page_init() {
  console.log("[COMMON][PAGE] INIT");

  // SET GAMEPLAY BOOL
  is_gameplay_page = window.location.pathname.endsWith("gameplay.html");
  console.log(`[COMMON] IS GAMEPLAY PAGE(${is_gameplay_page}`);

  // OSC FIRST TO THEN GET ELEMENT EVENTS
  osc_init();
  ui_init_events();
  viz_init();
  aud_init();

  // TODO - ADD A LISTENER ON UNLOAD TO SAVE CHANGES???
  document.addEventListener("WindowUnload", () => {
    common_page_unload();
  });

  // IF NOT GAMEPLAY, FIRST TIME, CHECK SESSION STORAGE, ASK ABOUT AUDIO
  if (!is_gameplay_page) {
    const aud_shown = sessionStorage.getItem("AUD_SHOWN");

    // SHOW MODAL WHICH PROVIDES A CHOICE AN FORCES AN INTERACTION
    if (!aud_shown) {
      sessionStorage.setItem("AUD_SHOWN", "Y");

      // GET AUD MODAL
      const aud_dialog = document.querySelector("#dialog_aud");

      // ADD UPDATE ON CLOSE
      aud_dialog.addEventListener("close", () => {
        console.log("[AUD] USER CONSENT DIALOG CLOSED");
      });

      // ENSURE LOGIC EXISTS ON AUD MODAL BUTTS
      aud_dialog
        .querySelector("#butt_aud_yes")
        .addEventListener("click", () => {
          gameAudio.setConsent(true);
          aud_set_muted(false);
          play_common_bg_music();
        });

      aud_dialog.querySelector("#butt_aud_no").addEventListener("click", () => {
        gameAudio.setConsent(true);
        aud_set_muted(true);
        gameAudio.setMusicPaused(true);
      });

      // FINALLY, SHOW MODAL
      aud_dialog.showModal();
    } else {
      play_common_bg_music();
    }
  }
}

// When user clicks "Yes" or "No"
function handleAudioChoice(choice) {
  sessionStorage.setItem("audioConfirmed", choice);

  // Hide modal
  document.getElementById("audio-modal").style.display = "none";

  if (choice === "yes") {
    startMusic(); // This is inside a click handler, so it will work
  }
}

function common_page_unload() {
  // AUTO SAVE TO HEROKU?
}

// =============================================================================
// ON SCREEN CONTROLS

// DYN ADD THE DIV TO BODY TO BE CONSISTENT WITH ALL PAGES

function osc_init() {
  const osc_div = document.createElement("div");

  osc_div.id = "os_controls";

  const butt_mute = document.createElement("button");
  butt_mute.id = "butt_aud_mute";
  butt_mute.classList.add("osc_butt");
  butt_mute.textContent = "    ";
  osc_div.appendChild(butt_mute);

  // SPACE IT?
  osc_div.appendChild(document.createElement("span"));

  const butt_crt = document.createElement("button");
  butt_crt.id = "ui_crt_toggle";
  butt_crt.classList.add("osc_butt");
  butt_crt.textContent = "    ";
  osc_div.appendChild(butt_crt);

  // ADD TO BODY
  document.body.appendChild(osc_div);
}

// =============================================================================
// RUN ASAP ON SCRIPT LOAD

console.log("[COMMON] PAGE LOAD");

if (!redirect_to_login()) {
  // REACHING HERE, IT DETERMINED USER LOGGED IN, SO REGISTER LOAD ON DOM
  document.addEventListener("DOMContentLoaded", () => {
    common_page_init();
  });
}
