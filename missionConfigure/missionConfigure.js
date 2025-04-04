// Pick languages

// Get Button Elements
const languageButtons = document.getElementsByClassName("language");
const startGame = document.getElementById("temp-start");

// TODO - DO THIS WHEN NECESSARY
export function clear_guest_scores() {
  console.log("[SCORES] CLEARING HIGH SCORE");

  // A) TITLE PAGE FIRST TIME
  // B) START NEW GAME
  // C) AFTER YOU ENTER YOUR NAME FOR HIGH SCORE
  localStorage.setItem("guest_score", -1);
  /// localStorage.clear()
}

const LOCAL_SCORES_KEY = 'local_scores';

export function add_new_high_score(
  _score,
  _initials,
  _language,
  _level,
  _difficulty
) {
  //
  console.log("[SCORES] ADDING NEW HIGH SCORE");

  // 1 ) GET ALL THE SCORES AS SERIALIZED JSON STRING
  let score_str = localStorage.getItem(LOCAL_SCORES_KEY);

  // NULL CHECK
  if (!score_str) {
    score_str = "[]";
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
  score_arr.sort((a,b) => b.score - a.score);

  // 4 ) SLICE THE ARRAY FOR TOP 50
  score_arr.splice(50);

  // SERIALISE THE NEW ARRAY
  const new_score_arr_str = JSON.stringify(score_arr);

  // 5 ) RE-SET IT ON LOCAL STORAGE
  localStorage.setItem(LOCAL_SCORES_KEY, new_score_arr_str);

  // TBD - MAYBE WE'LL DO IT ALL BY LAUNGE

  // ENJOY BROCCOLI
}

let pickedLanguages = [];

// Add event listener to each Language button
Array.from(languageButtons).forEach((button) => {
  button.addEventListener("click", function (event) {
    console.log(event.target);
    toggleActive(event.target);
    toggleAddToList(event.target);
    console.log(pickedLanguages);
  });
});

// Add / Remove language and CSSS
function toggleActive(button) {
  if (button.classList.contains("active-language")) {
    button.classList.remove("active-language");
  } else {
    button.classList.add("active-language");
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
}

// Save to local storage
startGame.addEventListener("click", function () {
  if (pickedLanguages.length != 0) {
    // Languages
    localStorage.setItem("pickedLanguages", JSON.stringify(pickedLanguages));
    // Difficulty
    localStorage.setItem("difficulty", pickedDifficulty);
    // Level
    localStorage.setItem("level", pickedLevel);

    // TEMPORARY REDIRECT
    window.location.href = "gameplay.html";
  } else {
    alert("Please pick your languages");
  }
});

// Temporary Difficulty Slider CSS
const difficultyDisplay = document.getElementById("difficulty-display");
const difficultySlider = document.getElementById("difficulty");

const difficultyValues = {
  1: "easy",
  2: "normal",
  3: "hard",
  4: "hardcore",
};

// Get difficulty value
difficultySlider.addEventListener("input", function () {
  let value = difficultyValues[this.value];
  difficultyDisplay.textContent = value;
  pickedDifficulty = value;
});

// Initial difficulty display
difficultyDisplay.textContent = difficultyValues[difficultySlider.value];

// Initial picked difficulty
let pickedDifficulty = difficultyValues[difficultySlider.value];

// Temporary Level Slider Css
const levelDisplay = document.getElementById("level-display");
const levelSlider = document.getElementById("level");

// Get level value
levelSlider.addEventListener("input", function () {
  levelDisplay.textContent = this.value;
  pickedLevel = this.value;
  console.log(pickedLevel);
});

// Initial level display
levelDisplay.textContent = levelSlider.value;

// Initial picked level
let pickedLevel = levelSlider.value;

console.log(pickedLevel);
