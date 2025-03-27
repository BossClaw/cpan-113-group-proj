
// Pick languages

// Get Button Elements

const languageButtons = document.getElementsByClassName("language");
let pickedLanguages = []

Array.from(languageButtons).forEach((button) => {
    button.addEventListener("click", function(event){
       toggleLanguageAddToList(event.target)
    })
})

function toggleLanguageAddToList(button){
    let selected = button.innerHTML
    if(pickedLanguages.includes(selected)){
        let index = pickedLanguages.indexOf(selected)
        pickedLanguages.splice(index, 1)
    }else{
      pickedLanguages.push(selected)  
    }
}