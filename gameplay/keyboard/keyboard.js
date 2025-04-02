document.addEventListener("keydown", (event) => {
  // PREVENT KEY FROM INTERACTING WITH THE PAGE
  event.preventDefault();

  // GET AND THEN CHECK FOR WIP DEBUGGING AND PREVENTING CONSOLE ERROR SPAM IN PROD
  const el = document.getElementById(event.code);
  if (el) {
    el.classList.add("active");
  } else {
    console.log(`[GAME][KEYBOARD] NO ELEMENT FOUND FOR [${event.code}]`);
  }
});

document.addEventListener("keyup", (event) => {
  // PREVENT KEY FROM INTERACTING WITH THE PAGE
  // TBD - WHAT WOULD LISTEN FOR KEYUP THAT WE DON'T ACTUALLY SET?
  event.preventDefault();

  // GET AND THEN CHECK FOR WIP DEBUGGING AND PREVENTING CONSOLE ERROR SPAM IN PROD
  const el = document.getElementById(event.code);
  if (el) {
    el.classList.remove("active");
  } else {
    console.log(`[GAME][KEYBOARD] NO ELEMENT FOUND FOR [${event.code}]`);
  }
});
