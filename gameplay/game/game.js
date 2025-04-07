import { Enemy } from "../enemy/enemy.js";
import { Player } from "../player/player.js";
import { GameView } from "../game-view/gameview.js";
import scoreManager from "./scoreManager.js";
import { initializeGameLogic } from "../gameplay.js";
import { set_background_glitch } from "../background.js";
import flaggedNames from "./flaggedNames.js";
import { gameAudio } from "../game-audio/gameAudio.js";
import { Mainframe } from "../mainframe/mainframe.js";
import { Firewall } from "../firewall/firewall.js";
import { enemeySpawnList } from "../enemy/enemySpawnList.js";

// Get level state
function getEnemyStates(_level = 1) {
  let level = Math.max(1, _level)

  // count
  const baseCount = 80;
  const countIncrase = 15;

  // spawn time
  const baseSpawnTime = 400;
  const spawnTimeDecrase = 20;
  const minSpawnTime = 100;

  // speed
  const baseSpeed = 0.5;
  const speedIncrase = 0.02;

  // Math stuffs
  const count = Math.floor(baseCount + countIncrase * Math.log2(level))
  const spawnTime = Math.max(minSpawnTime, baseSpawnTime - spawnTimeDecrase * Math.log2(level))
  const speed = baseSpeed + speedIncrase * Math.log2(level)

  return {
    count,
    speed,
    spawnTime
  };
}

const difficultySpeedModifier = {
  easy: 0.5,
  normal: 1,
  hard: 1.5,
  hardcore: 2,
};

export class Game {
  constructor(
    gameScreen,
    level = '1',
    difficulty = "easy",
    playerObject = null
  ) {
    // #game_screen div
    this.gameScreen = gameScreen
    this.gameScreen.innerHTML = "";

    // SET RANDOM BACKGROUND GLITCH
    set_background_glitch(this.gameScreen);

    // game status
    this.level = level
    this.difficulty = difficulty
    this.languages = []
    this.highScore = 0 // all levels added up
    this.isGame = false;
    this.isPaused = false;
    this.lastTimestamp = 0;
    this.spawnTimer = 0;
    this.animatedFrameId = null;

    // mainframe related
    this.mainframe = new Mainframe(this.gameScreen)
    this.mainframeDiv = null

    // firewall related
    this.firewall = new Firewall(this.gameScreen)
    this.firewallDiv = null;

    // player related
    this.playerObject = playerObject;
    this.player = null;

    // score
    this.scoreIncrement = 100
    this.scores = 0; // current level score

    // enemy related
    this.enemyCount = getEnemyStates(level).count;
    this.enemyLeft = getEnemyStates(level).count;
    this.levelEnemySpeed =
      getEnemyStates(level).speed * difficultySpeedModifier[difficulty];
    this.enemySpawnTime = getEnemyStates(level).spawnTime;
    // array of enemy level (number)
    this.enemeySpawnList = enemeySpawnList(this.enemyCount, Number(this.level), this.difficulty)
    // for enemy instance
    this.enemyArray = []

    // gameView
    this.gameView = new GameView(this.gameScreen);

    // show start message display
    this.gameView.showStartMessage(this.level, this.difficulty)

    // sonund toggle button
    this.gameView.soundToggle.addEventListener('click', this.toggleSound)

    // debug mode
    this.isDebugMode = true
    const oldDbug = document.querySelector('.debug')
    this.debugDiv = oldDbug ? oldDbug : document.createElement('div')
    this.debugDiv.classList.add('debug')
    document.body.appendChild(this.debugDiv)


    // bind methods just in case
    this.start = this.start.bind(this);
    this.update = this.update.bind(this);
    this.getGameStates = this.getGameStates.bind(this);
    this.onContinueBtnPress = this.onContinueBtnPress.bind(this);
    this.onRetryBtnPress = this.onRetryBtnPress.bind(this);
    this.onQuitBtnPress = this.onQuitBtnPress.bind(this);
  }
  setDebugMode(on = true) {
    this.isDebugMode = on
  }
  updateDebugInfo() {
    this.debugDiv.innerHTML = ''
    const levelInfo = document.createElement('p')
    levelInfo.innerText = `Level: ${this.level}`
    const enemyInfo = document.createElement('p')
    enemyInfo.innerText = `Enemy: ${this.enemyLeft} / ${this.enemyCount}`
    const scoreInfo = document.createElement('p')
    scoreInfo.innerText = `High Score: ${this.scores}`
    const infoElements = [levelInfo, enemyInfo, scoreInfo]
    infoElements.forEach(e => {
      this.debugDiv.appendChild(e)
    })
  }
  pause() {
    if (!this.isGame || this.isPaused) return;

    this.isPaused = true;

    // Cancel the current animation frame
    cancelAnimationFrame(this.animatedFrameId);

    // Pause all enemies
    this.enemyArray.forEach((e) => {
      if (e.isAlive) e.pause();
    });

    // Show pause screen
    this.gameView.displayPause(this.highScore);
  }
  resume() {
    if (!this.isGame || !this.isPaused) return;

    this.isPaused = false;

    // Resume all enemies
    this.enemyArray.forEach((e) => {
      if (e.isAlive) e.resume();
    });

    // Hide pause screen
    this.gameView.hideScreenOverley();

    //  Restart the game loop
    this.animationId = requestAnimationFrame(this.update);
  }
  toggleSound() {
    if (gameAudio.playerConsent) {
      // turn off
      gameAudio.setConsent(false)
      gameAudio.toggleMusic()
    } else {
      // turn on
      gameAudio.setConsent(true)
      gameAudio.toggleMusic()
    }
  }
  onFirewallAttacked(damage) {
    this.firewall.takeDamage(damage)
    this.firewall.updateHpDisplay()
  }
  onMainframeAttacked(damage) {

    // mainframe
    this.mainframe.takeDamage(damage)
    this.mainframe.updateHpDisplay()

    this.gameScreen.classList.remove("player-attack");
    this.gameScreen.classList.remove("on-hit");
    // force reflow
    void this.gameScreen.offsetWidth;
    this.gameScreen.classList.add("on-hit");
  }
  onPlayerAttack(isHit = true) {
    if (!this.isGame) return;
    if (this.isPaused) return;
    if (!isHit) {
      // missing the shot
      this.player.missed();
      // spawn new enemy (level: 0 the "error")
      const enemy = new Enemy(this.gameScreen, 'lv0', this.levelEnemySpeed);
      enemy.spawn();
      this.enemyArray.push(enemy);
      this.enemyCount++;
      this.enemyLeft++;
      // spawned enemy move rightaway
      enemy.move();
      return;
    }

    // find the closest enemy to shoot
    if (this.enemyArray.length === 0) return;
    let distance = Infinity;
    let target = null;

    // shake camera
    this.gameScreen.classList.remove("on-hit");
    this.gameScreen.classList.remove("player-attack");
    // force reflow
    //void this.gameScreen.offsetWidth;
    this.gameScreen.classList.add("player-attack");

    // Find the closest enemny
    this.enemyArray.forEach((enemy) => {
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
    if (!target) return;
    target.takeDamage(this.player.attack());
    // gain points
    this.scores += this.scoreIncrement;
  }
  // Setup enemies at the beginning
  async setup() {
    // check if this is the first leve in a playthough
    // clear current score left over
    if (!currentGame) {
      scoreManager.removeCurrentCore()
    }
    // spawn mainframe
    this.mainframeDiv = this.mainframe.spawn()

    // spawn fireWall
    this.firewallDiv = this.firewall.spawn()

    // spawn player
    if (this.playerObject) {
      const gun = this.playerObject.gun;
      const hat = this.playerObject.hat;
      this.player = new Player(this.gameScreen, gun, hat);
    } else {
      this.player = new Player(this.gameScreen);
    }
    this.player.spawn(this.gameScreen);

    // spawn enemy
    this.enemeySpawnList.forEach(level => {
      const enemy = new Enemy(this.gameScreen, `lv${level}`, this.levelEnemySpeed); // level 1
      enemy.spawn(this.gameScreen);
      this.enemyArray.push(enemy);
    })

    // set up gameview buttons
    const buttons = this.gameView.getButtons();

    // continue btn
    buttons.continue.addEventListener("click", this.onContinueBtnPress);
    // retry btn
    buttons.retry.addEventListener("click", this.onRetryBtnPress);
    // quit btn
    buttons.quit.addEventListener("click", this.onQuitBtnPress);
  }
  onContinueBtnPress(e) {
    if (e?.key && e.key !== 'c') return
    document.removeEventListener('keydown', this.onContinueBtnPress)

    // start a new game, to the next level
    startNewGame(this.gameScreen, Number(this.level) + 1, this.difficulty, this.playerObject)
  }
  onRetryBtnPress(e) {
    if (e?.key && e.key !== 'r') return
    document.removeEventListener('keydown', this.onRetryBtnPress)

    // start a new game with currnet level
    startNewGame(this.gameScreen, this.level, this.difficulty, this.playerObject)
  }
  onQuitBtnPress(e) {
    if (e?.key && e.key !== 'q') {
      return
    } else {
      e.preventDefault()
    }
    // add player name
    this.gameView.displayNameInput()

    const nameInput = this.gameView.nameInput
    const nameMessage = this.gameView.nameInputMessage
    const nameBtn = this.gameView.nameInputBtn
    nameMessage.innerText = ''
    nameInput.focus()
    document.removeEventListener('keydown', this.onQuitBtnPress)

    function onNameEnter() {
      try {
        // check name
        let name = nameInput.value.trim()
        if (name === '') throw new Error('Missing initials')
        if (name.length !== 3) throw new Error('must be 3 letters')

        // CAP the name
        name = name.toUpperCase()

        // check for bad name
        flaggedNames.forEach(flag => {
          if (name === flag) {
            throw new Error('Flagged initials')
          }
        })

        // all score data is already saved in game over check 
        // store player name to current score
        scoreManager.setCurrentScoreName(name)
        // push to local scores array
        scoreManager.addToHighScores()

        nameMessage.innerText = 'saving...'

        // remove listeners
        document.removeEventListener('click', onNameEnter)
        document.removeEventListener('keydown', onNameEnter)

        // back to home page
        setTimeout(() => {
          window.location.href = 'index.html'
        }, 1000)

      } catch (err) {
        nameMessage.innerText = err.message
      }
    }
    // Add Event Listeners
    nameBtn.addEventListener('click', onNameEnter)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        onNameEnter()
      }
    })
  }
  // (BUG) this can cause problem 
  addEndGameButtonsListeners(isWon = true) {

    if (isWon) {
      // add continue
      document.addEventListener('keydown', this.onContinueBtnPress)
    } else {
      // add retry
      document.addEventListener('keydown', this.onRetryBtnPress)
    }
    // add quit
    document.addEventListener('keydown', this.onQuitBtnPress)
  }
  // Main game loop
  update(timestamp) {
    // check is game running
    if (!this.isGame || this.isPaused) return;

    // check is game over
    this.checkGameOver();

    // game debug info
    if (this.isDebugMode) {
      this.updateDebugInfo()
    }

    // Check delta time
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const delta = timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    // Spawn Enemy if its time
    this.spawnTimer += delta;
    if (this.spawnTimer >= this.enemySpawnTime) {
      const nextEnemy = this.enemyArray.find((enemy) => !enemy.isMoving);
      if (nextEnemy) {
        nextEnemy.move();
        nextEnemy.isMoving = true;
      }
      this.spawnTimer = 0; // reset spawn timer
    }

    // check for enemey collision
    for (let i = 0; i < this.enemyArray.length; i++) {
      const enemy = this.enemyArray[i];

      if (!enemy.isAlive) continue;
      const enemyLocationX = enemy.getLocationX();

      // enemy reaching firewall
      if (this.firewallDiv && this.firewall.isAlive) {
        if (enemyLocationX - this.firewallDiv.getBoundingClientRect().left <= 0) {
          this.onFirewallAttacked(enemy.attack());
          continue;
        }
      }
      // enemy reaching mainframe
      if (this.mainframeDiv && this.mainframe.isAlive && enemyLocationX - this.mainframeDiv.getBoundingClientRect().right <= 0) {
        this.onMainframeAttacked(enemy.attack());
        continue;
      }
    }

    // (testing) show enemy info
    this.enemyArray.forEach((e) => {
      e.updateInfo();
    });

    // next frame
    this.animatedFrameId = requestAnimationFrame(this.update);
  }
  checkEnemyLeftCount() {
    {
      let count = 0;
      this.enemyArray.forEach((e) => {
        if (e.isAlive) count++;
      });
      this.enemyLeft = count;
    }
  }
  checkGameOver() {
    this.checkEnemyLeftCount();
    // win
    if (this.enemyLeft === 0) {
      this.isGame = false;
      // store current points
      this.saveToLocalStorage()
      // display
      this.gameView.displayWin(this.highScore);

      // add buttons listener
      this.addEndGameButtonsListeners(true)

      // WIN MUSIC
      gameAudio.playWinMusic()
      return;
    }

    // lose
    if (this.mainframe.hp <= 0) {
      this.isGame = false;
      // display
      this.gameView.displayLose(this.highScore);

      // add buttons listener
      this.addEndGameButtonsListeners(false)

      // LOSE MUSIC
      gameAudio.playLoseMusic()
      return;
    }
  }
  saveToLocalStorage() {
    // save scores
    scoreManager.addToCurrentScore(this.scores)
    // save level
    localStorage.setItem('level', this.level)
    // save difficulty
    localStorage.setItem('difficulty', this.difficulty)
    // save language
    localStorage.setItem('pickedLanguages', JSON.stringify(this.languages))

    // update gameStates
    this.getGameStates()
  }
  getGameStates() {
    // return everything about the current game
    const LANGUAGES_KEY = 'pickedLanguages';

    this.languages = JSON.parse(localStorage.getItem(LANGUAGES_KEY) || '[]')
    this.highScore = scoreManager.getCurrentScore().score

    const gameStates = {
      level: this.level,
      difficulty: this.difficulty,
      languages: this.languages,
      highScore: this.highScore,
      enemyCount: this.enemyCount,
      enemySpawnTime: this.enemySpawnTime,
      levelEnemySpeed: this.levelEnemySpeed,
    }
    return gameStates
  }
  setGameStatesToLocal() {
    // when go to next level
    // set the storage level
    // set current score
  }
  setHightScroeToLocal() {
    // add player name
    // add current score (local) to scores array (local)
  }
  start() {
    this.setup();
    this.isGame = true;
    this.getGameStates() // update game states
    // concent gameAudio
    gameAudio.setConsent()

    // play backgronud music
    gameAudio.playBackgroundMusic(false)

    // Run game
    requestAnimationFrame(this.update);
  }
}

// Start new game: create a new game instance
let currentGame = null;

export function startNewGame(gameScreen, level = 1, difficulty = "easy", playerObject = null) {
  if (currentGame && currentGame.animatedFrameId) {
    cancelAnimationFrame(currentGame.animatedFrameId);
  }
  // if this is the first game remove current scores
  if (!currentGame) {
    scoreManager.removeCurrentCore()
  }
  // Create a new game instance
  currentGame = new Game(gameScreen, level, difficulty, playerObject);

  // init gameplay using temp-gameplay
  initializeGameLogic(currentGame)
}