import { Enemy } from "../enemy/enemy.js";

// Get level state
function getLevelState(level = 1) {
  if (level < 1) level = 1
  // base 
  const baseEnemyCount = 5
  const baseEnemySpeed = 1

  // how many level to incrase
  const levelToIncraseCount = 2
  const levelToIncraseSpeed = 1

  // how much to incrase
  const countIncrase = 2
  const speedIncrase = 0.1

  const enemyCount = baseEnemyCount + Math.floor((level - 1) / levelToIncraseCount) * countIncrase
  const ememySpeed = baseEnemySpeed + Math.floor((level - 1) / levelToIncraseSpeed) * speedIncrase

  return {
    enemyCount, ememySpeed
  }
}

export class Game {
  constructor(gameScreen, level = 1, speedMotifier = 1) {
    // #game_screen div
    this.gameScreen = gameScreen
    // player related
    this.points = 0
    this.baseHp = 10
    this.fireWallHp = 3
    // enemy related
    this.enemyCount = getLevelState(level).enemyCount
    this.ememySpeed = getLevelState(level).ememySpeed
  }
}


// Testing
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game(null, 2)
  console.log(game)
})