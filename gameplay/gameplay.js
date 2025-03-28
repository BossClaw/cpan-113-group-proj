
let pickedLanguages = []
let index = 0


// Import words.json
async function importWords(){
    try{
       const response = await fetch("./gameplay/words.json")
        const data = await response.json()
        let wordList = data.words
        console.log(wordList) 
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
    pickedLanguages = localStorage.getItem("pickedLanguages")
    console.log("picked languages", pickedLanguages)
    generateWord()
    
}



// Generate a new word
function generateWord(){
    let randomIndex = Math.floor(Math.random() * pickedLanguages.length)
    console.log(randomIndex)
    let randomLanguage = pickedLanguages[randomIndex]
    console.log("random languages", randomLanguage)

    // Random Word
    let languageWords = wordList[randomLanguage]
    console.log(wordList[randomLanguage])
    randomIndex = Math.floor(Math.random() * languageWords.length)
    word = languageWords[randomIndex]

    displayWord(word)
}

// Display word function
const wordLetters = document.getElementById("word-container")
function displayWord(word){
    console.log(wordLetters)
    for(let char of word){
        const span = document.createElement("span")
        const node = document.createTextNode(char)
        span.appendChild(node)
        wordLetters.appendChild(span)
    }
}