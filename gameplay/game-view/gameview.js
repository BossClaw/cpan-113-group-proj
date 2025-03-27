// UI and display for the game-view screen


export class GameView {
  constructor(gameScreen) {
    this.gameScreen = gameScreen
  }
  displayGameStats(gameStateObject) {
    const old = document.querySelector('.game-states')
    if (old) {
      old.remove()
    }
    const states = document.createElement('div')
    states.classList.add('game-states')
    for (const key in gameStateObject) {
      const p = document.createElement('p')
      p.innerText = `${key} : ${gameStateObject[key]}`
      states.appendChild(p)
    }
    this.gameScreen.appendChild(states)
  }
  displayWin() {
    const gameOverDive = document.createElement('div')
    gameOverDive.classList.add('gameover-div', 'win')
    gameOverDive.innerText = 'YOU WIN'
    this.gameScreen.appendChild(gameOverDive)

  }
  displayLose() {
    const gameOverDive = document.createElement('div')
    gameOverDive.classList.add('gameover-div', 'lose')
    gameOverDive.innerText = 'YOU LOSE'
    this.gameScreen.appendChild(gameOverDive)
  }
}