import { Enemy } from "../enemy/enemy.js";

// Get level state
function getLevelState(level = 1) {
  if (level < 1) level = 1
  // base 
  const baseEnemyCount = 5
  const baseEnemySpeed = 1
  const baseEnmeySpawnTime = 1000

  // how many level to incrase
  const levelToIncraseCount = 2
  const levelToIncraseSpeed = 1

  // how much to incrase
  const countIncrase = 2
  const speedIncrase = 0.1

  const enemyCount = baseEnemyCount + Math.floor((level - 1) / levelToIncraseCount) * countIncrase
  const ememySpeed = baseEnemySpeed + Math.floor((level - 1) / levelToIncraseSpeed) * speedIncrase
  const ememySpawnTime = baseEnmeySpawnTime // just 3 second for now

  return {
    enemyCount, ememySpeed, ememySpawnTime
  }
}

export class Game {
  constructor(gameScreen, level = 1, speedMotifier = 1) {
    // #game_screen div
    this.gameScreen = gameScreen

    // game status
    this.lastTimestamp = 0;
    this.spawnTimer = 0;

    // player related
    this.points = 0
    this.baseHp = 10
    this.fireWallHp = 3
    // enemy related
    this.enemyArray = [] // all the enemy in this level (add level control later eg: [1, 1, 1, 2, 1, 1])
    this.enemyCount = getLevelState(level).enemyCount
    this.ememySpeed = getLevelState(level).ememySpeed * speedMotifier
    this.enemySpawnTime = getLevelState(level).ememySpawnTime

    // bind methods just in case
    this.start = this.start.bind(this)
    this.update = this.update.bind(this)
  }
  // Setup enemies at the beginning
  setup() {
    for (let i = 0; i < this.enemyCount; i++) {
      const enemy = new Enemy(this.gameScreen, 1); // level 1
      enemy.spawn()
      this.enemyArray.push(enemy);
      console.log('enemy spawn')
    }
    console.log('Initial Enemies:', this.enemyArray);
  }

  // Main game loop
  update(timestamp) {
    // timestamp is from requestAnimationFrame, its the time since game start
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    // delta time is time since last frame
    // can use delta to motify movment speed (so computer has the same speed)
    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // move the next enemy
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.enemySpawnTime) {
      const nextEnemy = this.enemyArray.find(enemy => !enemy.isMoving);
      if (nextEnemy) {
        nextEnemy.move();
        nextEnemy.isMoving = true;
      }
      this.spawnTimer = 0; // reset spawn timer
    }
    requestAnimationFrame(this.update);
  }
  start() {
    this.setup();
    requestAnimationFrame(this.update);
  }
}


// Testing
document.addEventListener('DOMContentLoaded', () => {
  // #game_screen
  const gameScreen = document.querySelector('#game_screen')
  const game = new Game(gameScreen, 2)
  game.start()

})