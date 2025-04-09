// COMMON JS TO EVERY PAGE IN THE PROJECT
// TBD - SPLIT .JS UP INTO FOCUSED FILES : backend.js, audio.js, video.js, etc...

import { dev_init, dev_add_fps, dev_log_mesg } from "./dev.js";
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
  dev_log_mesg("[COMMON][PAGE][UI] INIT");

  // ADD CRT TOGGLE
  document.querySelector("#ui_crt_toggle").addEventListener("click", () => {
    crt_toggle();
  });

  // ADD SHOW MODAL TO BUTTS
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
      dev_log_mesg(`[COMMON][DIALOG] TRY CLOSING DIALOG[${parent_dialog.id}]`);
      parent_dialog.close();
    });
  });
}

// =================================================================
// AUDIO WRAPPER

const AUD_VOLUME_KEY = "aud_volume";

function aud_get_volume() {
  var cur_volume = parseFloat(localStorage.getItem(AUD_VOLUME));
  dev_log_mesg(`[COMMON][AUD] get_volume(${cur_volume})`);
  return cur_volume;
}

function aud_set_volume(volume_val) {
  dev_log_mesg(`[COMMON][AUD] set_volume(${volume_val})`);
  localStorage.setItem(AUD_VOLUME, volume_val);

  update_aud_dom();
}

function update_aud_dom() {
  // UPDATE THE AUDIO DOM WITH MUTE / VOLUME VALS
}

// =================================================================
// AUD WRAPPER

function play_common_bg_music() {
  gameAudio.setConsent(true);
  gameAudio.play(
    "audio/music/Phat_Phrog_Studios_Retro_Fragments.mp3",
    true,
    true
  );
}

function aud_init() {
  dev_log_mesg("[COMMON][PAGE][AUD] INIT");

  // COMMON PAGE BG MUSIC
  aud_update_dom();

  var aud_mute = document.querySelector("#butt_aud_mute");

  if (!aud_mute) {
    console.error("Element with ID 'butt_aud_mute' not found.");
    return;
  }

  aud_mute.addEventListener("click", () => {
    aud_mute_toggle();
  });
}

const VIZ_AUD_MUTED_KEY = "aud_muted";

function aud_get_muted() {
  var cur_aud_val = localStorage.getItem(VIZ_AUD_MUTED_KEY) == "true";
  dev_log_mesg(`[COMMON][AUD] get_muted(${cur_aud_val})`);
  return cur_aud_val;
}

function aud_set_muted(aud_muted) {
  // TODO - ALIGN ALL THESE VALUES PROPERLY
  dev_log_mesg(`[COMMON][AUD] set_muted(${aud_muted})`);
  localStorage.setItem(VIZ_AUD_MUTED_KEY, aud_muted);

  // UPDATE THE PLAYING
  gameAudio.setConsent(true);
  gameAudio.toggleMusic();

  // UPDATE THE ICON
  aud_update_dom();
}

function aud_mute_toggle() {
  dev_log_mesg("[COMMON][AUD] TOGGLE MUTED CLICKED");

  // CALC INVERSE
  const mute_inverse = !aud_get_muted();
  dev_log_mesg(
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
    dev_log_mesg(`[COMMON][AUD] NO DOM FOUND TO UPDATE`);
    return;
  }

  const aud_is_muted = aud_get_muted();

  dev_log_mesg(
    `[COMMON][AUD] UPDATING DOM[${target.id}] MUTED(${aud_is_muted})`
  );

  // SET SPEAKER SPRITE BY CLASS
  if (aud_is_muted) {
    target.classList.add("aud_icon_muted");
    target.classList.remove("aud_icon_loud");
  } else {
    target.classList.remove("aud_icon_muted");
    target.classList.add("aud_icon_loud");
  }
}

// =================================================================
// VIZ WRAPPER

function viz_init() {
  dev_log_mesg("[COMMON][PAGE][VIZ] INIT");

  viz_init_bg();

  crt_set_enabled(crt_get_enabled());
}

// =================================================================
// VIZ CRT

const VIZ_CRT_ENABLED_KEY = "viz_crt_enabled";

function crt_get_enabled() {
  // TRY GET VAL FROM STORAGE
  var cur_crt_val = localStorage.getItem(VIZ_CRT_ENABLED_KEY) == "true";
  dev_log_mesg(`[COMMON][VIZ][CRT] get_enabled(${cur_crt_val})`);

  return cur_crt_val;
}

function crt_set_enabled(crt_enabled) {
  dev_log_mesg(`[COMMON][VIZ][CRT] SETTING ENABLED(${crt_get_enabled()})`);
  localStorage.setItem(VIZ_CRT_ENABLED_KEY, crt_enabled);
  crt_update_dom();
}

function crt_toggle() {
  dev_log_mesg("[COMMON][VIZ][CRT] TOGGLE CLICKED");
  // CALC INVERSE
  const crt_inverse = !crt_get_enabled();
  dev_log_mesg(
    `[COMMON][VIZ][CRT] CUR(${crt_get_enabled()}) TOGGLING TO(${crt_inverse})`
  );

  // STORE & APPLY INVERSE
  crt_set_enabled(crt_inverse);
}

// UPDATE THE DOM BASED ON VAL
function crt_update_dom() {
  // GET THE BODY/DIV/DOM ELEMENT TARGET FOR CRT
  var target = document.querySelector("body");
  const crt_is_enabled = crt_get_enabled();

  dev_log_mesg(
    `[COMMON][VIZ][CRT] UPDATING DOM[${target}] ENABLED(${crt_is_enabled})`
  );

  if (crt_is_enabled) {
    target.classList.add("crt");
  } else {
    target.classList.remove("crt");
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
    dev_log_mesg(`GOT INFOS(${view_info_arr.length})`);

    view_button_arr = document.querySelectorAll(".viewect_butt");
    dev_log_mesg(`GOT BUTTONS(${view_button_arr.length})`);

    view_ahref_arr = document.querySelectorAll(".view_ahref");
    dev_log_mesg(`GOT AHREFS(${view_ahref_arr.length})`);

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
      dev_log_mesg("SHOWING " + pi);
      view_info_arr[pi].style.display = "flex";

      targ_div = view_info_arr[pi];
    } else {
      dev_log_mesg("HIDING " + pi);
      view_info_arr[pi].style.display = "none";
    }
  }
}

// =======================================================================
// COMMON PAGE STUFF

function common_page_init() {
  dev_log_mesg("[COMMON][PAGE] INIT");

  // ENABLE DEV BY CHECKING LOCAL STORAGE
  if (localStorage.getItem("dev_enable_fps")) {
    dev_init();    
  }

  // OSC FIRST TO THEN GET ELEMENT EVENTS
  osc_init();
  ui_init_events();
  viz_init();

  // TODO - ADD A LISTENER ON UNLOAD TO SAVE CHANGES???
  document.addEventListener("WindowUnload", () => {
    common_page_unload();
  });

  // FIRST TIME, CHECK SESSION STORAGE, ASK ABOUT AUDIO
  const aud_shown = sessionStorage.getItem("AUD_SHOWN");

  // SHOW MODAL WHICH PROVIDES A CHOICE AN FORCES AN INTERACTION
  if (!aud_shown) {
    sessionStorage.setItem("AUD_SHOWN", "Y");

    // GET AUD MODAL
    const aud_dialog = document.querySelector("#dialog_aud");

    // ADD UPDATE ON CLOSE
    aud_dialog.addEventListener("close", () => {
      aud_init();
    });

    // ENSURE LOGIC EXISTS ON AUD MODAL BUTTS
    aud_dialog.querySelector("#butt_aud_yes").addEventListener("click", () => {
      // USER CHOSE YES
      play_common_bg_music();
    });
    aud_dialog.querySelector("#butt_aud_no").addEventListener("click", () => {
      // USER CHOSE NO
      gameAudio.stopMusic();
    });

    // FINALLY, SHOW MODAL
    aud_dialog.showModal();
  } else {
    // CALL EVAL MUSIC START WHICH RESPECTS THEIR CHOICE
    play_common_bg_music();
    aud_init();
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

  const butt_crt = document.createElement("button");
  butt_crt.id = "ui_crt_toggle";
  butt_crt.textContent = `CRT`;
  osc_div.appendChild(butt_crt);

  const butt_mute = document.createElement("button");
  butt_mute.id = "butt_aud_mute";
  osc_div.appendChild(butt_mute);

  // ADD TO BODY
  document.body.appendChild(osc_div);
}

// =============================================================================
// RUN ASAP ON SCRIPT LOAD

dev_log_mesg("[COMMON] PAGE LOAD");

if (!redirect_to_login()) {
  // REACHING HERE, IT DETERMINED USER LOGGED IN, SO REGISTER LOAD ON DOM
  document.addEventListener("DOMContentLoaded", () => {
    common_page_init();
  });
}
