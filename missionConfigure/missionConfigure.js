
// Pick languages

// Get Button Elements

const languageButtons = document.getElementsByClassName("language");
let pickedLanguages = []
console.log(languageButtons)
console.log(typeof languageButtons)
Array.from(languageButtons).forEach((button) => {
    console.log(button)
    button.addEventListener("click", function(event){
        console.log(event.target)
       toggleActive(event.target)
       toggleAddToList(event.target)
    })
})
    

function toggleActive(button){
    if(button.classList.contains("active-language")){
        button.classList.remove("active-language")
    }else{
        button.classList.add("active-language")
    }
}

function toggleAddToList(button){
    let selected = button.innerHTML
    if(pickedLanguages.includes(selected)){
        let index = pickedLanguages.indexOf(selected)
        pickedLanguages.splice(index, 1)
    }else{
      pickedLanguages.push(selected)  
    }
}