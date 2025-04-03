import { Enemy } from "../enemy/enemy.js";
import { Player } from "../player/player.js";
import { GameView } from "../game-view/gameview.js";
import scoreManager from "./scoreManager.js";
import { initializeGameLogic } from "./temp-gameplay.js";
import flaggedNames from "./flaggedNames.js";


// Get level state
function getLevelState(level = 1) {
  if (level < 1) level = 1;
  // base
  const baseEnemyCount = 15;
  const baseEnemySpeed = 0.5;
  const baseEnmeySpawnTime = 500;

  // how many level to incrase
  const levelToIncraseCount = 2;
  const levelToIncraseSpeed = 1;
  const levelToDecraseSpawnTime = 2;

  // how much to incrase
  const countIncrase = 2;
  const speedIncrase = 0.05;
  const spawnTimeDecrase = 100;
  const minSpawnTime = 200;

  const enemyCount =
    baseEnemyCount +
    Math.floor((level - 1) / levelToIncraseCount) * countIncrase;
  const ememySpeed =
    baseEnemySpeed +
    Math.floor((level - 1) / levelToIncraseSpeed) * speedIncrase;
  const spawnTime =
    baseEnmeySpawnTime -
    Math.floor((level - 1) / levelToDecraseSpawnTime) * spawnTimeDecrase;
  let ememySpawnTime;
  if (spawnTime < minSpawnTime) {
    ememySpawnTime = minSpawnTime;
  } else {
    ememySpawnTime = spawnTime;
  }

  return {
    enemyCount,
    ememySpeed,
    ememySpawnTime,
  };
}

const difficultSpeedModifer = {
  easy: 0.5,
  normal: 1,
  hard: 2,
  hardcore: 3,
};

export class Game {
  constructor(
    gameScreen,
    level = 1,
    difficulty = "easy",
    playerObject = null
  ) {
    // #game_screen div
    this.gameScreen = gameScreen;

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

    // player related
    this.playerObject = playerObject;
    this.player = null;
    this.points = 0; // current level score
    this.baseHP = 3;
    this.firewallHP = 1;
    this.firewallLocationX = "100px";
    this.firewall = null;

    // enemy related
    this.enemyArray = []; // all the enemy in this level (add level control later eg: [1, 1, 1, 2, 1, 1])
    this.enemyCount = getLevelState(level).enemyCount;
    this.enemyLeft = getLevelState(level).enemyCount;
    this.levelEnemySpeed =
      getLevelState(level).ememySpeed * difficultSpeedModifer[difficulty];
    this.enemySpawnTime = getLevelState(level).ememySpawnTime;

    // gameView
    this.gameView = new GameView(this.gameScreen);

    // show start message display
    this.gameView.showStartMessage(this.level, this.difficulty)

    // bind methods just in case
    this.start = this.start.bind(this);
    this.update = this.update.bind(this);
    this.getGameStates = this.getGameStates.bind(this);
    this.onContinueBtnPress = this.onContinueBtnPress.bind(this);
    this.onRetryBtnPress = this.onRetryBtnPress.bind(this);
    this.onQuitBtnPress = this.onQuitBtnPress.bind(this);
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
  onFirewallAttacked(damage) {
    this.firewallHP -= damage;
    this.firewall.classList.remove("player-attack");
    this.firewall.classList.remove("on-hit");
    // force reflow
    void this.firewall.offsetWidth;
    this.firewall.classList.add("on-hit");

    // check is firewall destroyed
    // give a little time for possible animaiton
    if (this.firewallHP <= 0) {
      const temp = this.firewall;
      this.firewall = null;
      setTimeout(() => {
        temp.remove();
      }, 500);
    }
  }
  onBasedAttacked(damage) {
    this.baseHP -= damage;
    this.gameScreen.classList.remove("player-attack");
    this.gameScreen.classList.remove("on-hit");
    // force reflow
    void this.gameScreen.offsetWidth;
    this.gameScreen.classList.add("on-hit");
  }
  onPlayerAttack(isHit = true) {
    console.log('player Attack:', isHit)
    if (!this.isGame) return;
    if (this.isPaused) return;
    if (!isHit) {
      // missing the shot
      this.player.missed();
      // spawn new enemy (level: 0 the "error")
      const enemy = new Enemy(this.gameScreen, 0, this.levelEnemySpeed);
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
    void this.gameScreen.offsetWidth;
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
    this.points++;
  }
  // Setup enemies at the beginning
  async setup() {
    // update game states display
    // this.updateGameStats();

    // check if this is the first leve in a playthough
    // clear current score left over
    if (!currentGame) {
      scoreManager.removeCurrentCore()
    }
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
    for (let i = 0; i < this.enemyCount; i++) {
      const enemy = new Enemy(this.gameScreen, 1, this.levelEnemySpeed); // level 1
      enemy.spawn(this.gameScreen);
      this.enemyArray.push(enemy);
    }
    // spawn fireWall
    const fireWall = document.createElement("div");
    fireWall.classList.add("firewall");
    fireWall.style.height = this.gameScreen.offsetHeight + "px";
    fireWall.style.left = this.firewallLocationX;
    this.gameScreen.appendChild(fireWall);
    this.firewall = fireWall;

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
  onRetryBtnPress() {
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
          window.location.href = '/'
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

    // update game states display
    //this.updateGameStats();

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
      if (this.firewall) {
        const fireWallDistance =
          enemyLocationX -
          (this.firewall.getBoundingClientRect().left -
            this.gameScreen.getBoundingClientRect().left);
        if (fireWallDistance <= 0) {
          this.onFirewallAttacked(enemy.attack());
        }
        continue;
      }
      // enemy reaching base
      if (enemyLocationX <= 0) {
        this.onBasedAttacked(enemy.attack());
      }
    }

    // (testing) show enemy info
    this.enemyArray.forEach((e) => {
      e.updateInfo();
    });

    // next frame
    this.animatedFrameId = requestAnimationFrame(this.update);
  }
  getGameStats() {
    return {
      baseHP: this.baseHP,
      firewallHP: this.firewallHP,
      points: this.points,
      enemy: `${this.enemyLeft} / ${this.enemyCount}`,
    };
  }
  updateGameStats() {
    // this.gameView.updateGameStats(this.getGameStats());
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
      return;
    }

    // lose
    if (this.baseHP <= 0) {
      this.isGame = false;
      // display
      this.gameView.displayLose(this.highScore);

      // add buttons listener
      this.addEndGameButtonsListeners(false)
      return;
    }
  }
  saveToLocalStorage() {
    // save scores
    scoreManager.addToCurrentScore(this.points)
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
    const CURRENT_SCORE_KEY = "settings_current_score";
    const SCORES_KEY = "settings_scores";
    const DIFFICULTY_KEY = 'difficulty';
    const LEVEL_KEY = 'level';
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

    // Run game
    requestAnimationFrame(this.update);

  }
}

// Start new game: create a new game instance
let currentGame = null;
function startNewGame(gameScreen, level = 1, difficulty = "easy", playerObject = null) {
  if (currentGame && currentGame.animatedFrameId) {
    cancelAnimationFrame(currentGame.animatedFrameId);
  }
  // Clear screen
  gameScreen.innerHTML = "";

  // Create a new game instance
  currentGame = new Game(gameScreen, level, difficulty, playerObject);

  // init gameplay using temp-gameplay
  initializeGameLogic(currentGame)
}