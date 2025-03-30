// HELPER FUNCS
function randi(exclusive_max) {
    return Math.floor(Math.random() * exclusive_max)
}

function isValidNumberRegex(input) {
    return /^-?\d{1,3}(,\d{3})*(\.\d+)?$|^-?\d+(\.\d+)?$/.test(input);
}

