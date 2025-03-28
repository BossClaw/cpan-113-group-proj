
let pickedLanguages = null
let index = 0

// Check local storage

if(!localStorage.getItem("pickedLanguages")){
    // TEMPORARY CODE - go back to mission configure page to pick languages
    window.location.href = "http://127.0.0.1:5502/missionConfigure.html"
}else {
    pickedLanguages = localStorage.getItem("pickedLanguages")
}

// Import words.json
const response = await fetch("./gameplay/words.json");
const data = await response.json();
let wordList = data.words
console.log(wordList)

