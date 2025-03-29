import { Enemy } from "../enemy/enemy.js";
import { Player } from "../player/player.js";
import { GameView } from "../game-view/gameview.js";

const wordsJsonPath = '../words.json'

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
  const levelToDecraseSpawnTime = 2

  // how much to incrase
  const countIncrase = 2
  const speedIncrase = 0.05
  const spawnTimeDecrase = 100
  const minSpawnTime = 200

  const enemyCount = baseEnemyCount + Math.floor((level - 1) / levelToIncraseCount) * countIncrase
  const ememySpeed = baseEnemySpeed + Math.floor((level - 1) / levelToIncraseSpeed) * speedIncrase
  const spawnTime = baseEnmeySpawnTime - Math.floor((level - 1) / levelToDecraseSpawnTime) * spawnTimeDecrase
  let ememySpawnTime
  if (spawnTime < minSpawnTime) {
    ememySpawnTime = minSpawnTime
  } else {
    ememySpawnTime = spawnTime
  }

  return {
    enemyCount, ememySpeed, ememySpawnTime
  }
}

const difficultSpeedModifer = {
  'easy': 0.1,
  'normal': 1,
  'hard': 2,
  'hardcore': 3,
}

export class Game {
  constructor(gameScreen, level = 1, difficulty = 'easy', language = 'JavaScript', playerObject = null) {
    // #game_screen div
    this.gameScreen = gameScreen

    // game status
    this.isGame = false
    this.isPaused = false
    this.lastTimestamp = 0;
    this.spawnTimer = 0;
    this.animatedFrameId = null

    // player related
    this.playerObject = playerObject
    this.player = null
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

    // keyboard related
    this.language = language
    this.languageList = []
    this.nextKey = 'a'

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
  pause() {
    if (!this.isGame || this.isPaused) return;

    this.isPaused = true;

    // Cancel the current animation frame
    cancelAnimationFrame(this.animatedFrameId);

    // Pause all enemies
    this.enemyArray.forEach(e => {
      if (e.isAlive) e.pause();
    });

    // Show pause screen
    this.gameView.displayPause();
  }
  resume() {
    if (!this.isGame || !this.isPaused) return;

    this.isPaused = false;

    // Resume all enemies
    this.enemyArray.forEach(e => {
      if (e.isAlive) e.resume();
    });

    // Hide pause screen
    this.gameView.hideScreenOverley();

    //  Restart the game loop
    this.animationId = requestAnimationFrame(this.update);
  }
  async getLanguageList() {
    // try {
    //   const response = await fetch(wordsJsonPath)
    //   const json = await response.json()
    //   const words = json.words

    //   let lang = this.language.charAt(0).toUpperCase() + this.language.slice(1).toLowerCase()

    //   console.log('words', words)
    //   console.log('lang', lang)

    //   // try to get the language
    //   const languageList = words[lang]
    //   if (!languageList) {
    //     this.languageList = words.JavaScript
    //   } else {
    //     this.languageList = languageList
    //   }
    //   console.log('languageList', languageList)

    // } catch (err) {
    //   console.error('Fail to fetch words.json')
    // }
  }
  setNextKey(key) {
    this.nextKey = key
  }
  getNextKey(key) {
    return this.nextKey
  }
  onFirewallAttacked(damage) {
    this.firewallHP -= damage
    this.firewall.classList.remove('player-attack');
    this.firewall.classList.remove('on-hit');
    // force reflow
    void this.firewall.offsetWidth;
    this.firewall.classList.add('on-hit');

    // check is firewall destroyed
    // give a little time for possible animaiton 
    if (this.firewallHP <= 0) {
      const temp = this.firewall
      this.firewall = null
      setTimeout(() => {
        temp.remove()
      }, 500)
    }

  }
  onBasedAttacked(damage) {
    this.baseHP -= damage
    this.gameScreen.classList.remove('player-attack')
    this.gameScreen.classList.remove('on-hit');
    // force reflow
    void this.gameScreen.offsetWidth;
    this.gameScreen.classList.add('on-hit');
  }
  onPlayerAttack(isHit = true) {
    if (!this.isGame) return
    if (this.isPaused) return
    if (!isHit) {
      // missing the shot
      this.player.missed()
      // spawn new enemy (level: 0 the "error") 
      const enemy = new Enemy(this.gameScreen, 0, this.levelEnemySpeed)
      enemy.spawn()
      this.enemyArray.push(enemy)
      this.enemyCount++
      this.enemyLeft++
      // spawned enemy move rightaway
      enemy.move()
      return
    }

    // find the closest enemy to shoot
    if (this.enemyArray.length === 0) return
    let distance = Infinity
    let target = null

    // shake camera
    this.gameScreen.classList.remove('on-hit');
    this.gameScreen.classList.remove('player-attack');
    // force reflow
    void this.gameScreen.offsetWidth;
    this.gameScreen.classList.add('player-attack');

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
    // gain points
    this.points++
  }
  // Setup enemies at the beginning
  async setup() {

    // update game states display
    this.updateGameStats()

    // spawn player
    if (this.playerObject) {
      const gun = this.playerObject.gun
      const hat = this.playerObject.hat
      this.player = new Player(this.gameScreen, gun, hat)
    } else {
      this.player = new Player(this.gameScreen)
    }
    this.player.spawn(this.gameScreen)

    // spawn enemy
    for (let i = 0; i < this.enemyCount; i++) {
      const enemy = new Enemy(this.gameScreen, 1, this.levelEnemySpeed); // level 1
      enemy.spawn(this.gameScreen)
      this.enemyArray.push(enemy);
    }

    // spawn fireWall
    const fireWall = document.createElement('div')
    fireWall.classList.add('firewall')
    fireWall.style.height = this.gameScreen.offsetHeight + 'px'
    fireWall.style.left = this.firewallLocationX
    this.gameScreen.appendChild(fireWall);
    this.firewall = fireWall

    // set up game view buttons
    const buttons = this.gameView.getButtons()
    buttons.retry.addEventListener('click', () => {
      window.location.reload()
    })
    buttons.quit.addEventListener('click', () => {
      // to another page
      alert('quit the game...')
      window.location.reload()
    })
    buttons.leaderboardBtn.addEventListener('click', () => {
      // to another page
      alert('to leaderboard...')
      window.location.reload()
    })
  }

  // Main game loop
  update(timestamp) {
    // check is game running
    if (!this.isGame || this.isPaused) return;

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
    for (let i = 0; i < this.enemyArray.length; i++) {
      const enemy = this.enemyArray[i]

      if (!enemy.isAlive) continue
      const enemyLocationX = enemy.getLocationX()

      // enemy reaching firewall
      if (this.firewall) {
        const fireWallDistance = enemyLocationX - (this.firewall.getBoundingClientRect().left - this.gameScreen.getBoundingClientRect().left)
        if (fireWallDistance <= 0) {
          this.onFirewallAttacked(enemy.attack())
        }
        continue
      }
      // enemy reaching base
      if (enemyLocationX <= 0) {
        this.onBasedAttacked(enemy.attack())
      }
    }

    // (testing) show enemy info
    this.enemyArray.forEach(e => {
      e.updateInfo()
    })

    // next frame
    this.animatedFrameId = requestAnimationFrame(this.update);
  }
  getGameStats() {
    return {
      baseHP: this.baseHP,
      firewallHP: this.firewallHP,
      points: this.points,
      enemy: `${this.enemyLeft} / ${this.enemyCount}`
    }
  }
  updateGameStats() {
    this.gameView.updateGameStats(this.getGameStats())
  }
  checkEnemyLeftCount() {
    {
      let count = 0;
      this.enemyArray.forEach(e => {
        if (e.isAlive) count++;
      });
      this.enemyLeft = count;
    }
  }
  checkGameOver() {
    this.checkEnemyLeftCount()
    if (this.enemyLeft === 0) {
      this.isGame = false
      this.gameView.displayWin()
      return
    }

    if (this.baseHP <= 0) {
      this.isGame = false
      this.gameView.displayLose()
      return
    }
  }
  start() {
    this.setup()
    this.isGame = true
    requestAnimationFrame(this.update);
  }
}

// -------------- Steps --------------
// 1. create game instance
// 2. game.getLanguageList()
// 3. game.start() [player interaction]
// -----------------------------------

// Testing ---------------------------
// document.addEventListener('DOMContentLoaded', () => {
//   // get #game_screen
//   const gameScreen = document.querySelector('#game_screen')

//   // create game
//   const game = new Game(gameScreen, 10, 'normal', 'python')
//   // set up the game (get words)
//   console.log('game', game)

//   const startBtn = document.querySelector('#start')
//   const pauseBtn = document.querySelector('#pause')

//   // start game
//   startBtn.addEventListener('click', () => {
//     game.start()
//     startBtn.style.display = 'none'
//     pauseBtn.style.display = 'block'
//   })


//   // pauss / resume game
//   pauseBtn.addEventListener('click', () => {
//     if (game.isPaused) {
//       game.resume();  // If paused, resume
//       pauseBtn.innerText = 'pause';
//     } else {
//       game.pause();   // If not paused, pause
//       pauseBtn.innerText = 'Resume';
//     }
//   });

//   // (testing) trigger player attack
//   // using setTimout to avoid it becoming called right away, it cause onPlayerAttack to already auto trigger on game start
//   setTimeout(() => {
//     // Hit "A" to attack
//     // Hit anything to missed
//     document.addEventListener('keyup', (e) => {

//       if ((e.metaKey && e.key === 'r') || (e.ctrlKey && e.key === 'r')) return;
//       if (e.key === null) return
//       // correct
//       if (e.key === 'a') {
//         game.onPlayerAttack()

//       } else {
//         game.onPlayerAttack(false)
//       }
//     })
//   }, 500)
// })



