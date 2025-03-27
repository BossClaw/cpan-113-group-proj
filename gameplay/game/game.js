import { Enemy } from "../enemy/enemy.js";
import { Player } from "../player/player.js";

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
  const speedIncrase = 0.05

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
  'hard': 2,
  'hardcore': 3,
}

export class Game {
  constructor(gameScreen, level = 1, difficulty = 'easy', player) {
    // #game_screen div
    this.gameScreen = gameScreen

    // game status
    this.isGame = false
    this.lastTimestamp = 0;
    this.spawnTimer = 0;

    // player related
    this.player = player
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
  retry() {
    // do the current level again
  }
  nextLevel() {
    // reset the game and go to next game
  }
  pauss() {
    // pasuss the game
  }
  showGameStartMessage() {
    // show game start messages
  }
  showWinScreen() {
    // show game win screen
  }
  showLoseScreen() {
    // show game lose screen
  }
  onPlayerShoot() {
    // find the closest enemy to shoot
    if (this.enemyArray.length === 0) return
    let distance = Infinity
    let target = null

    // find enemy
    this.enemyArray.forEach(enemy => {
      if (!enemy.isAlive) return
      const enemyX = enemy.div.getBoundingClientRect().left
      const currentDistance = enemyX - this.player.div.getBoundingClientRect().left
      if (distance > currentDistance) {
        distance = currentDistance
        target = enemy
      }
    })
    // shoot it
    if (!target) return
    target.takeDamage(this.player.attack())
  }
  onPlayerMiss() {

  }
  // Setup enemies at the beginning
  setup() {
    // spawn player
    if (!this.player) {
      alert('Missing player instance in game constructure')
      return
    }
    const playerDiv = this.player.spawn(this.gameScreen)
    this.player.div = playerDiv

    // spawn enemy
    for (let i = 0; i < this.enemyCount; i++) {
      const enemy = new Enemy(this.gameScreen, 1, this.levelEnemySpeed); // level 1
      const enemyDiv = enemy.spawn(this.gameScreen)
      enemy.div = enemyDiv
      this.enemyArray.push(enemy);
      console.log('enemy spawn')
    }

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

    // (maybe keyboard have here <--------)
    // 

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

    // check for enemey collision
    for (let i = 0; i < this.enemyArray.length - 1; i++) {
      const enemy = this.enemyArray[i]
      if (!enemy.isAlive) continue
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
        continue
      }

      // enemy reaching base
      let distance = enemyX - baseX
      if (distance <= 0) {
        this.baseHp -= enemy.attack()
        console.log('baseHP', this.baseHp)
      }
    }

    // show enemy info
    this.enemyArray.forEach(e => {
      e.updateInfo()
    })

    // (testing) update basehp
    document.querySelector('#basehp').innerText = this.baseHp


    // check game over
    let enemyAlive = false
    this.enemyArray.forEach(e => {
      if (e.isAlive) enemyAlive = true
    })
    if (!enemyAlive) {
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

    // next frame
    requestAnimationFrame(this.update);
  }
  start() {
    this.setup();
    this.isGame = true
    requestAnimationFrame(this.update);
  }
}

// Testing
document.addEventListener('DOMContentLoaded', () => {
  // get #game_screen
  const gameScreen = document.querySelector('#game_screen')
  // create player
  const player = new Player(gameScreen)
  // create game
  const game = new Game(gameScreen, 10, 'normal', player)
  console.log('game', game)
  game.start()


  // testing player attack
  const keyDiv = document.createElement('div')
  const body = document.querySelector('body')
  body.appendChild(keyDiv)
  keyDiv.style.position = 'absolute';
  keyDiv.style.width = '100px'
  keyDiv.style.backgroundColor = 'red'
  keyDiv.style.top = '100px'
  document.addEventListener('keyup', e => {
    console.log('Key released:', e.key); // <- add this for debugging
    if (e.key === null) return
    // correct
    if (e.key === 'a') {
      game.onPlayerShoot()
      keyDiv.innerText = 'shoot'

    } else {
      keyDiv.innerText = 'missed'
    }
  })

})



