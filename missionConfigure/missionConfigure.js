// Pick languages

// Get Button Elements
const languageButtons = document.getElementsByClassName("language");
const startGame = document.getElementById("temp-start");

localStorage.clear()

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
  // Languages
  localStorage.setItem("pickedLanguages", JSON.stringify(pickedLanguages));
  // Difficulty
  localStorage.setItem("difficulty", pickedDifficulty)

  // TEMPORARY REDIRECT
  window.location.href = "http://127.0.0.1:5502/gameplay.html";
});


// Temporary Slider CSS
const difficultyDisplay = document.getElementById("difficulty-display")
const slider = document.getElementById("difficulty")

const difficultyValues = {
  1: "easy",
  2: "normal",
  3: "hard",
  4: "hardcore"
}

slider.addEventListener("input", function(){
  console.log(slider.value)
  console.log(difficultyDisplay)
  let value = difficultyValues[this.value]
  console.log("value", value)
  difficultyDisplay.textContent = value
  pickedDifficulty = value
})

// Initial difficulty display
difficultyDisplay.textContent = difficultyValues[slider.value]

// Initial picked difficulty
let pickedDifficulty = difficultyValues[slider.value]