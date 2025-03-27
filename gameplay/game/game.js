import { Enemy } from "../enemy/enemy.js";
import { Player } from "../player/player.js";
import { GameView } from "../game-view/gameview.js";

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
    this.baseHP = 3
    this.firewallHP = 1
    this.firewallLocationX = '100px'
    this.firewall = null

    // enemy related
    this.enemyArray = [] // all the enemy in this level (add level control later eg: [1, 1, 1, 2, 1, 1])
    this.enemyCount = getLevelState(level).enemyCount
    this.enemyLeft = getLevelState(level).enemyCount
    this.levelEnemySpeed = getLevelState(level).ememySpeed * difficultSpeedModifer[difficulty]
    this.enemySpawnTime = getLevelState(level).ememySpawnTime

    // gameView
    this.gameView = new GameView(this.gameScreen)

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
  playerAttack(missed = false) {
    if (missed) {
      // missing the shot
      return
    }

    // find the closest enemy to shoot
    if (this.enemyArray.length === 0) return
    let distance = Infinity
    let target = null

    // Find the closest enemny
    this.enemyArray.forEach(enemy => {
      // Skip if enemy is not alive
      if (!enemy.isAlive) return;

      const enemyLocationX = enemy.getLocationX();
      const playerLocationX = this.player.getLocationX();
      const currentDistance = enemyLocationX - playerLocationX;

      // Find the closest enemny
      if (currentDistance < distance) {
        // Check if the enemy is fully visible inside the game screen
        const screenRect = this.gameScreen.getBoundingClientRect();
        const enemyRect = enemy.outerDiv.getBoundingClientRect();

        // is enemy fully inside the screen
        const isFullyInside =
          enemyRect.left >= screenRect.left &&
          enemyRect.right <= screenRect.right;

        if (!isFullyInside) return;
        distance = currentDistance;
        target = enemy;
      }
    });
    // shoot it
    if (!target) return
    target.takeDamage(this.player.attack())
  }
  // Setup enemies at the beginning
  setup() {
    // update game states display
    this.updateGameStats()

    // spawn player
    this.player.spawn(this.gameScreen)

    // spawn enemy
    for (let i = 0; i < this.enemyCount; i++) {
      const enemy = new Enemy(this.gameScreen, 1, this.levelEnemySpeed); // level 1
      enemy.spawn(this.gameScreen)
      this.enemyArray.push(enemy);
      console.log('enemy spawn')
    }

    // spawn fireWall
    const fireWall = document.createElement('div')
    fireWall.classList.add('firewall')
    fireWall.style.height = this.gameScreen.offsetHeight + 'px'
    fireWall.style.left = this.firewallLocationX
    this.gameScreen.appendChild(fireWall);
    this.firewall = fireWall

    console.log('Initial Enemies:', this.enemyArray);
  }

  // Main game loop
  update(timestamp) {
    // check is game running
    if (!this.isGame) return

    // check is game over
    this.checkGameOver()

    // update game states display
    this.updateGameStats()

    // (maybe keyboard have here <--------)
    // 

    // Check delta time
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Spawn Enemy if its time
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
      const enemyLocationX = enemy.getLocationX()

      // enemy reaching firewall
      if (this.firewall) {
        const fireWallDistance = enemyLocationX - (this.firewall.getBoundingClientRect().left - this.gameScreen.getBoundingClientRect().left)
        if (fireWallDistance <= 0) {
          this.firewallHP -= enemy.attack()
          if (this.firewallHP <= 0) {
            this.firewall.remove()
            this.firewall = null
          }
        }
        continue
      }
      // enemy reaching base
      if (enemyLocationX <= 0) {
        this.baseHP -= enemy.attack()
        console.log('baseHP', this.baseHP)
      }
    }

    // (testing) show enemy info
    this.enemyArray.forEach(e => {
      e.updateInfo()
    })

    // next frame
    requestAnimationFrame(this.update);
  }
  updateGameStats() {
    this.gameView.displayGameStats({
      baseHP: this.baseHP,
      firewallHP: this.firewallHP,
      points: this.points,
      enemy: `${this.enemyLeft} / ${this.enemyCount}`
    })
  }
  checkEnemyLeft() {
    {
      let count = 0;
      this.enemyArray.forEach(e => {
        if (e.isAlive) count++;
      });
      this.enemyLeft = count;
    }
  }
  checkGameOver() {
    this.checkEnemyLeft()
    if (this.enemyLeft === 0) {
      console.log('You win')
      this.isGame = false
      this.gameView.displayWin()
      return
    }

    if (this.baseHP <= 0) {
      console.log('You lose')
      this.isGame = false
      this.gameView.displayLose()
      return
    }
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


  // (testing) showing player attack
  const keyDiv = document.createElement('div')
  const body = document.querySelector('body')
  body.appendChild(keyDiv)
  keyDiv.style.position = 'absolute';
  keyDiv.style.width = '100px'
  keyDiv.style.backgroundColor = 'red'
  keyDiv.style.top = '100px'


  // (testing) trigger player attack
  document.addEventListener('keyup', e => {
    console.log('Key released:', e.key); // <- add this for debugging
    if (e.key === null) return
    // correct
    if (e.key === 'a') {
      game.playerAttack()
      keyDiv.innerText = 'shoot'

    } else {
      keyDiv.innerText = 'missed'
    }
  })

})



