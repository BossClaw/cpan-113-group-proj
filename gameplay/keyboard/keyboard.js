document.addEventListener("keydown", event => {
    event.preventDefault()
    document.getElementById(event.code).classList.add("active")
})

document.addEventListener("keyup", event => {
    document.getElementById(event.code).classList.remove("active")
})