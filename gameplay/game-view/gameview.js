// UI and display for the game-view screen


export class GameView {
  constructor(gameScreen) {
    this.gameScreen = gameScreen

    // screen overlay (win,lose,pause)
    this.gameScreenOverlay = document.createElement('div')
    this.gameScreenOverlay.classList.add('screen-overlay')
    this.gameScreen.appendChild(this.gameScreenOverlay)
    this.overlay = false

    // screen overlay 
    this.title = document.createElement('p')
    this.title.classList.add('screen-overlay-title')
    this.gameScreenOverlay.appendChild(this.title)

    // screen overly buttons
    this.buttonsDiv = document.createElement('div')
    this.buttonsDiv.classList.add('screen-overlay-buttons-div')
    this.retryBtn = document.createElement('button')
    this.quitBtn = document.createElement('button')
    this.leaderboardBtn = document.createElement('button')
    this.retryBtn.innerText = 'Retry'
    this.quitBtn.innerText = 'Quit'
    this.leaderboardBtn.innerText = 'Leaderboard'
    this.buttonsDiv.appendChild(this.retryBtn)
    this.buttonsDiv.appendChild(this.quitBtn)
    // this.buttonsDiv.appendChild(this.leaderboardBtn)
    this.gameScreenOverlay.appendChild(this.buttonsDiv)

    // game stats
    this.gameStates = document.createElement('div')
    this.gameStates.classList.add('game-states')
    this.gameScreen.appendChild(this.gameStates)
  }
  getButtons() {
    return {
      retry: this.retryBtn,
      quit: this.quitBtn,
      leaderboardBtn: this.leaderboardBtn
    }
  }
  hideScreenOverley() {
    this.gameScreenOverlay.style.display = 'none'
    this.overlay = false
  }
  hideGameStats() {
    this.gameStates.style.display = 'none'
  }
  updateGameStats(gameStateObject) {
    // clear, and update stats
    this.gameStates.style.display = 'flex'
    this.gameStates.innerHTML = ''
    for (const key in gameStateObject) {
      const p = document.createElement('p')
      p.innerText = `${key} : ${gameStateObject[key]}`
      this.gameStates.appendChild(p)
    }
  }
  displayWin() {
    this.gameScreenOverlay.classList.add('win')
    this.title.innerText = 'YOU WIN'
    this.gameScreenOverlay.style.display = 'flex'
    this.overlay = true
  }
  displayLose() {
    this.gameScreenOverlay.classList.add('lose')
    this.title.innerText = 'YOU LOSE'
    this.gameScreenOverlay.style.display = 'flex'
    this.overlay = true
  }
  displayPause() {
    this.gameScreenOverlay.classList.add('pause')
    this.title.innerText = 'Pause'
    this.gameScreenOverlay.style.display = 'flex'
  }
}