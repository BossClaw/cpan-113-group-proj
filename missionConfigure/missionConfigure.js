// Pick languages

// Get Button Elements

const languageButtons = document.getElementsByClassName("language");
const startGame = document.getElementById("temp-start");

localStorage.clear()

let pickedLanguages = [];
console.log(languageButtons);
console.log(typeof languageButtons);
Array.from(languageButtons).forEach((button) => {
  button.addEventListener("click", function (event) {
    console.log(event.target);
    toggleActive(event.target);
    toggleAddToList(event.target);
    console.log(pickedLanguages);
  });
});

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

startGame.addEventListener("click", function () {
  localStorage.setItem("pickedLanguages", pickedLanguages);
  // TEMPORARY REDIRECT
  window.location.href = "http://127.0.0.1:5502/gameplay.html";
});
