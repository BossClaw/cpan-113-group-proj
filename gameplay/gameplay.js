// Variables for word 
let pickedLanguages = []
let letterToTypeIndex = 0
let displayedWord = ""
const wordLetters = document.getElementById("word-container")



// Import words.json
async function importWords(){
    try{
       const response = await fetch("./gameplay/words.json")
        const data = await response.json()
        let wordList = data.words
        return wordList
    }catch(error){
        console.error(error)
        throw error
    }
}

const wordList = await importWords()


// Check local storage

if(!localStorage.getItem("pickedLanguages")){
    // TEMPORARY CODE - go back to mission configure page to pick languages
    window.location.href = "http://127.0.0.1:5502/missionConfigure.html"
}else {
    pickedLanguages = JSON.parse(localStorage.getItem("pickedLanguages"))
    generateWord()
}

// Display word function
function displayWord(word){
    for(let char of word){
        const span = document.createElement("span")
        const node = document.createTextNode(char)
        span.appendChild(node)
        wordLetters.appendChild(span)
    }
}

// Clear the word, reset word index
function clearWordDisplay() {
    wordLetters.innerHTML = ""
    letterToTypeIndex = 0
}

// Generate a new word
function generateWord(){
    // Get random language from picked language
    let randomIndex = Math.floor(Math.random() * pickedLanguages.length)
    let randomLanguage = pickedLanguages[randomIndex]


    // Get random word from language
    let languageWords = wordList[randomLanguage]
    randomIndex = Math.floor(Math.random() * languageWords.length)
    displayedWord = languageWords[randomIndex]

    displayWord(displayedWord)
}


// Update letter display, if correct letter typed, change color
function updateDisplay(key){
    let letterToType = wordLetters.getElementsByTagName("span")[letterToTypeIndex]
    if (key === letterToType.innerHTML){
            letterToType.style.color = "green"
            letterToTypeIndex += 1
        }

    checkForCompletion(letterToTypeIndex)
}


// Check if word is fully typed, if it is then clear word and generate new word
function checkForCompletion(letterToTypeIndex){
    if (letterToTypeIndex === displayedWord.length){
        clearWordDisplay()
        generateWord()
    } 
}


// EVENT LISTENER ON PAGE KEYDOWN
document.addEventListener("keydown", event => {
    event.preventDefault()
    updateDisplay(event.key)
})