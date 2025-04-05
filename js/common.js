// COMMON JS TO EVERY PAGE IN THE PROJECT
// TBD - SPLIT .JS UP INTO FOCUSED FILES : backend.js, audio.js, video.js, etc...

import { viz_init_bg } from "./bg.js";
import { gameAudio } from "../gameplay/game-audio/gameAudio.js";

// TBD - ONLY 2 .HTML FILES, index.html & play.html

// READ THE HTML STORAGE

// EVAL IF LOGGED IN USER / FLAT USER DATA FILE

// REDIRECT IF NECESSARY

// LOAD USER PROFILE DATA

// PROCEED TO REGULAR PAGE LOAD

// =================================================================
// WIP - TEMPLATE STYLE

// react style
// export function addCommonToElement(elementId, componentFunction) {
//   document.addEventListener("DOMContentLoaded", () => {
//     const element = document.getElementById(elementId);
//     if (element) {
//       element.innerHTML = componentFunction();
//     } else {
//       console.warn(`Element with ID '${elementId}' not found.`);
//     }
//   });
// }

// FETCH STYLE
export function addCommonToElement(elementId) {
  const element = document.getElementById(elementId);
  console.log(`[COMMON][DOM] FETCHING[${elementId}] ELEMENT[${element}]`);

  if (element) {
    element.innerHTML = fetch(`./common/${elementId}.html`);
  } else {
    console.warn(`Element with ID '${elementId}' not found.`);
  }
}

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
  document.querySelector("#ui_crt_toggle").addEventListener("click", () => {
    crt_toggle();
  });
}

// =================================================================
// AUDIO WRAPPER

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

function aud_init() {
  console.log("[COMMON][PAGE][AUD] INIT");

  // COMMON PAGE BG MUSIC
  gameAudio.setConsent();
  gameAudio.play(
    "audio/music/Phat_Phrog_Studios_Retro_Fragments.mp3",
    true,
    true
  );

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
  console.log(`[COMMON][AUD] get_muted(${cur_aud_val})`);
  return cur_aud_val;
}

function aud_set_muted(aud_muted) {
  console.log(`[COMMON][AUD] set_muted(${aud_muted})`);
  localStorage.setItem(VIZ_AUD_MUTED_KEY, aud_muted);
  
  // UPDATE THE PLAYING
  gameAudio.setConsent(true);
  gameAudio.toggleMusic();

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

  console.log(`[COMMON][AUD] UPDATING DOM[${target.id}] MUTED(${aud_is_muted})`);

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
  var target = document.querySelector("body");
  const crt_is_enabled = crt_get_enabled();

  console.log(
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

function common_page_init() {
  console.log("[COMMON][PAGE] INIT");

  ui_init_events();
  viz_init();
  aud_init();

  // TODO - ADD A LISTENER ON UNLOAD TO SAVE CHANGES???
  document.addEventListener("WindowUnload", () => {
    common_page_unload();
  });
}

function common_page_unload() {
  // AUTO SAVE TO HEROKU?
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
