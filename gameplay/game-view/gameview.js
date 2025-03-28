// UI and display for the game-view screen


export class GameView {
  constructor(gameScreen) {
    this.gameScreen = gameScreen

    // screen overlay (win,lose,pauss)
    this.gameScreenOverlay = document.createElement('div')
    this.gameScreenOverlay.classList.add('screen-overlay')
    this.gameScreen.appendChild(this.gameScreenOverlay)

    // game stats
    this.gameStates = document.createElement('div')
    this.gameStates.classList.add('game-states')
    this.gameScreen.appendChild(this.gameStates)
  }
  hideScreenOverley() {
    this.gameScreenOverlay.style.display = 'none'
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
    this.gameScreenOverlay.innerText = 'YOU WIN'
    this.gameScreenOverlay.style.display = 'flex'
  }
  displayLose() {
    this.gameScreenOverlay.classList.add('lose')
    this.gameScreenOverlay.innerText = 'YOU LOSE'
    this.gameScreenOverlay.style.display = 'flex'
  }
  displayPauss() {
    this.gameScreenOverlay.classList.add('pauss')
    this.gameScreenOverlay.innerText = 'Pauss'
    this.gameScreenOverlay.style.display = 'flex'
  }
}