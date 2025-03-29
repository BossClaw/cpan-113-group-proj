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

const difficultSpeedModifer = {
  'easy': 0.5,
  'normal': 1,
  'hard': 1.5,
  'hardcore': 2,
}

export class Game {
  constructor(gameScreen, level = 1, difficulty = 'easy') {
    // #game_screen div
    this.gameScreen = gameScreen

    // game status
    this.isGame = false
    this.lastTimestamp = 0;
    this.spawnTimer = 0;

    // player related
    this.points = 0
    this.baseHp = 3
    this.fireWallHp = 1
    this.fireWallLocationX = '100px'
    this.fireWall = null

    // enemy related
    this.enemyArray = [] // all the enemy in this level (add level control later eg: [1, 1, 1, 2, 1, 1])
    this.enemyCount = getLevelState(level).enemyCount
    this.levelEnemySpeed = getLevelState(level).ememySpeed * difficultSpeedModifer[difficulty]
    this.enemySpawnTime = getLevelState(level).ememySpawnTime

    // bind methods just in case
    this.start = this.start.bind(this)
    this.update = this.update.bind(this)
  }
  // Setup enemies at the beginning
  setup() {
    // spawn enemy
    for (let i = 0; i < this.enemyCount; i++) {
      const enemy = new Enemy(this.gameScreen, 1, this.levelEnemySpeed); // level 1
      const div = enemy.spawn()
      enemy.div = div
      this.enemyArray.push(enemy);
      console.log('enemy spawn')
    }

    // spawn player
    //

    // spawn fireWall
    const fireWall = document.createElement('div')
    fireWall.classList.add('firewall')
    fireWall.style.height = this.gameScreen.offsetHeight + 'px'
    fireWall.style.left = this.fireWallLocationX
    this.gameScreen.appendChild(fireWall);
    this.fireWall = fireWall

    console.log('Initial Enemies:', this.enemyArray);
  }

  // Main game loop
  update(timestamp) {
    if (!this.isGame) return

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

    // check for collision
    for (let i = this.enemyArray.length - 1; i >= 0; i--) {
      const enemy = this.enemyArray[i]
      const enemyX = enemy.div.getBoundingClientRect().left
      const baseX = this.gameScreen.getBoundingClientRect().left

      // enemy reaching firewall
      if (this.fireWall) {
        const fireWallX = this.fireWall.getBoundingClientRect().left
        let distance = enemyX - fireWallX
        if (distance <= 0) {
          this.fireWallHp -= enemy.attack()
          if (this.fireWallHp <= 0) {
            this.fireWall.remove()
            this.fireWall = null
          }
        }
      }

      // enemy reaching base
      let distance = enemyX - baseX
      if (distance <= 0) {
        this.baseHp -= enemy.attack()
        console.log('baseHP', this.baseHp)
        this.enemyArray.splice(i, 1)
      }
    }


    // show enemy info
    this.enemyArray.forEach(e => {
      e.updateInfo()
    })

    // check game over
    if (this.enemyArray.length === 0) {
      console.log('You win')
      this.isGame = false
      alert('You win')
      return
    }

    if (this.baseHp <= 0) {
      console.log('You lose')
      this.isGame = false
      alert('You lose')
      return
    }

    requestAnimationFrame(this.update);
  }
  start() {
    this.setup();
    this.isGame = true
    requestAnimationFrame(this.update);
  }
  checkCollision() {

  }
}


// Testing
document.addEventListener('DOMContentLoaded', () => {
  // #game_screen
  const gameScreen = document.querySelector('#game_screen')
  const game = new Game(gameScreen, 1, 'easy')
  console.log('game', game)
  game.start()
})