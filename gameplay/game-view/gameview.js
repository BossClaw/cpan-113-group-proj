// UI and display for the game-view screen


export class GameView {
  constructor(gameScreen) {
    this.gameScreen = gameScreen

    // word-container
    this.wordContainer = document.createElement('div')
    this.wordContainer.classList.add('word')
    this.wordContainer.id = 'word-container'
    this.gameScreen.appendChild(this.wordContainer)

    // starting-display
    this.startingDisplay = document.createElement('div')
    this.startingDisplay.classList.add('start-display')
    this.startingDisplay.id = 'starting-display'
    this.gameScreen.appendChild(this.startingDisplay)

    // starting-display text
    this.startingDisplayEnter = document.createElement('p')
    this.startingDisplayEnter.classList.add('start-display-enter')
    this.startingDisplayEnter.innerText = 'Press Enter To Start'
    this.startingDisplay.appendChild(this.startingDisplayEnter)

    // starting-display game info
    this.startingDisplayLevel = document.createElement('p')
    this.startingDisplayLevel.classList.add('start-display-level')
    this.startingDisplayLevel.innerText = 'Level: 999'
    this.startingDisplay.appendChild(this.startingDisplayLevel)

    this.startingDisplayDiff = document.createElement('p')
    this.startingDisplayDiff.classList.add('start-display-diff')
    this.startingDisplayDiff.innerText = 'Difficulty: Normal'
    this.startingDisplay.appendChild(this.startingDisplayDiff)


    // screen overlay (win,lose,pause)
    this.gameScreenOverlay = document.createElement('div')
    this.gameScreenOverlay.classList.add('screen-overlay')
    this.gameScreen.appendChild(this.gameScreenOverlay)
    this.overlay = false

    // title 
    this.title = document.createElement('p')
    this.title.classList.add('screen-overlay-title')
    this.title.innerText = 'win/lose/pause'
    this.gameScreenOverlay.appendChild(this.title)

    // hight scores
    this.highScoreDiv = document.createElement('div')
    this.highScoreDiv.classList.add('highscore-div')
    this.gameScreenOverlay.appendChild(this.highScoreDiv)

    this.highScoreTitle = document.createElement('p')
    this.highScoreTitle.classList.add('highscore-title')
    this.highScoreTitle.innerText = 'HI-SCORE'
    this.highScoreDiv.appendChild(this.highScoreTitle)

    this.highScore = document.createElement('p')
    this.highScore.classList.add('highscore-score')
    this.highScore.innerText = '00000'
    this.highScoreDiv.appendChild(this.highScore)

    // buttons div
    this.buttonsDiv = document.createElement('div')
    this.buttonsDiv.classList.add('screen-overlay-buttons-div')

    // Continue button
    this.continueBtn = document.createElement('button')
    this.continueBtn.classList.add('crt')
    this.continueBtn.id = 'continue-btn'
    this.continueBtn.innerText = 'Continue'

    // retry button
    this.retryBtn = document.createElement('button')
    this.retryBtn.classList.add('crt')
    this.retryBtn.id = 'rety-btn'
    this.retryBtn.innerText = 'Retry'

    // quit button
    this.quitBtn = document.createElement('button')
    this.quitBtn.classList.add('crt')
    this.quitBtn.id = 'quit-btn'
    this.quitBtn.innerText = 'Quit'

    // append buttons to buttonsDiv
    this.buttonsDiv.appendChild(this.continueBtn)
    this.buttonsDiv.appendChild(this.retryBtn)
    this.buttonsDiv.appendChild(this.quitBtn)

    // append buttonsDiv to screen overlay
    this.gameScreenOverlay.appendChild(this.buttonsDiv)

    // Name input
    this.nameInputDiv = document.createElement('div')
    this.nameInputDiv.classList.add('namn-input-div')
    this.gameScreenOverlay.appendChild(this.nameInputDiv)

    this.nameInputTitle = document.createElement('div')
    this.nameInputTitle.classList.add('name-input-title')
    this.nameInputTitle.innerText = 'ENTER YOUR INITIALS'
    this.nameInputDiv.appendChild(this.nameInputTitle)

    this.nameInputLowerDiv = document.createElement('div')
    this.nameInputLowerDiv.classList.add('name-input-lower-div')
    this.nameInputDiv.appendChild(this.nameInputLowerDiv)

    this.nameInput = document.createElement('input')
    this.nameInput.classList.add('name-input')
    this.nameInput.maxLength = '3'
    this.nameInput.placeholder = '---'
    this.nameInputLowerDiv.appendChild(this.nameInput)

    this.nameInputBtn = document.createElement('button')
    this.nameInputBtn.classList.add('name-input-btn')
    this.nameInputBtn.innerText = 'OK'
    this.nameInputLowerDiv.appendChild(this.nameInputBtn)

    this.nameInputMessage = document.createElement('span')
    this.nameInputMessage.classList.add('name-input-message')
    this.nameInputMessage.innerText = 'Message here'
    this.nameInputDiv.appendChild(this.nameInputMessage)

    // (Test) game stats
    // this.gameStates = document.createElement('div')
    // this.gameStates.classList.add('game-states')
    // this.gameScreen.appendChild(this.gameStates)
  }
  getButtons() {
    return {
      continue: this.continueBtn,
      retry: this.retryBtn,
      quit: this.quitBtn,
    }
  }
  showStartMessage(level, difficulty) {
    this.startingDisplay.style.display = 'felx'
    this.startingDisplayLevel.innerText = `LVL: ${level}`
    this.startingDisplayDiff.innerText = `DIFF: ${difficulty}`
  }
  hideScreenOverley() {
    this.gameScreenOverlay.style.display = 'none'
    this.overlay = false
  }
  hideGameStats() {
    this.gameStates.style.display = 'none'
  }
  // (Test) clear, and update stats
  updateGameStats(gameStateObject) {
    this.gameStates.style.display = 'flex'
    this.gameStates.innerHTML = ''
    for (const key in gameStateObject) {
      const p = document.createElement('p')
      p.innerText = `${key} : ${gameStateObject[key]}`
      this.gameStates.appendChild(p)
    }
  }
  displayWin(_highscroe = 0) {
    // hide name input
    this.nameInputDiv.style.display = 'none'
    // show win
    this.gameScreenOverlay.classList.add('win')
    this.buttonsDiv.style.display = 'flex'
    this.title.innerText = 'YOU WIN'
    this.highScore.innerText = _highscroe
    this.gameScreenOverlay.style.display = 'flex'
    this.overlay = true
  }
  displayLose(_highscroe = 0) {
    // hide name input
    this.nameInputDiv.style.display = 'none'
    // show lose
    this.gameScreenOverlay.classList.add('lose')
    this.buttonsDiv.style.display = 'flex'
    this.title.innerText = 'YOU LOSE'
    this.highScore.innerText = _highscroe
    this.gameScreenOverlay.style.display = 'flex'
    this.overlay = true
  }
  displayPause(_highscroe = 0) {
    // hide name input
    this.nameInputDiv.style.display = 'none'
    // hide buttons
    this.buttonsDiv.style.display = 'none'
    // show pause 
    this.gameScreenOverlay.classList.add('pause')
    this.title.innerText = 'Pause'
    this.highScore.innerText = _highscroe
    this.gameScreenOverlay.style.display = 'flex'
    this.overlay = true
  }
  displayNameInput() {
    // show name input
    this.nameInputDiv.style.display = 'flex'

    // hide buttons
    this.buttonsDiv.style.display = 'none'
  }
}