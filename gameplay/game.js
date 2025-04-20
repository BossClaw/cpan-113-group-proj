import { gameAudio } from './audio/gameAudio.js';
import { Enemy } from './enemy/enemy.js';
import { enemySpawnList } from './enemy/enemySpawnList.js';
import { Player } from './player/player.js';
import { GameView } from './gameview.js';
import { set_background_glitch } from './background/background.js';
import { Firewall } from './firewall/firewall.js';
import { Mainframe } from './mainframe/mainframe.js';
import { flaggedNames } from './ui/flaggedNames.js';
import scoreManager from './ui/scoreManager.js';
import { initializeGameLogic } from './gameplay.js';

// ==========================================================================================================
// LEVEL / ENEMY STATES

// Get level state
function getEnemyStates(_level = 1) {
	let level = Math.max(1, _level);

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
	const count = Math.floor(baseCount + countIncrase * Math.log2(level));
	const spawnTime = Math.max(minSpawnTime, baseSpawnTime - spawnTimeDecrase * Math.log2(level));
	const speed = baseSpeed + speedIncrase * Math.log2(level);

	return {
		count,
		speed,
		spawnTime,
	};
}

// ==========================================================================================================
// DIFF SPEED MODIFIER

const difficultySpeedModifier = {
	easy: 0.3,
	normal: 1,
	hard: 1.5,
	hardcore: 2,
};

// ==========================================================================================================
// GAME CLASS

export class Game {
	// CONSTRUCTOR
	constructor(gameScreen, level = '1', difficulty = 'easy', playerObject = null) {
		console.log(`[GAME][GAME] CONSTRUCTING NEW GAME`);

		// MAKE THE GAME DATA, LOGIC, DOM

		// [TEST DEVELOPER STUFF - FOR TESTING - IMPORTANT - DO NOT TOUCH]
		this.GOD_MODE = true

		// #game_screen div
		this.gameScreen = gameScreen;
		this.gameScreen.innerHTML = '';

		// game status
		this.MAX_LEVEL = 30
		this.level = level;
		this.difficulty = difficulty;
		this.languages = [];

		// score
		this.scoreIncrement = 100;
		this.scores = 0; // current level score
		this.highScore = 0; // all levels added up

		// time / frame
		this.animatedFrameId = null;
		this.lastTimestamp = 0;
		this.spawnTimer = 0;

		// game states
		this.isGame = false;
		this.isPaused = false;
		this.isEnterName = false;
		this.isWon = false;
		this.canKeyboardPress = true;

		// SET RANDOM BACKGROUND GLITCH
		set_background_glitch(this.level, this.gameScreen);

		// player related
		this.playerObject = playerObject;
		this.player = null;

		// mainframe related
		this.mainframe = new Mainframe(this.gameScreen);
		this.mainframeDiv = null;

		// firewall related
		this.firewall = new Firewall(this.gameScreen);
		this.firewallDiv = null;

		// enemy related
		this.enemyCount = getEnemyStates(level).count;
		this.enemyLeft = getEnemyStates(level).count;
		this.levelEnemySpeed = getEnemyStates(level).speed * difficultySpeedModifier[difficulty];
		this.enemySpawnTime = getEnemyStates(level).spawnTime;

		// array of enemy level (number)
		this.enemeySpawnList = enemySpawnList(this.enemyCount, Number(this.level), this.difficulty);

		// for enemy instance
		this.enemyArray = [];

		// gameView
		this.gameView = new GameView(this.gameScreen);

		// show start message display
		this.gameView.showStartMessage(this.level, this.difficulty);

		// debug mode
		this.isDebugMode = false;
		const oldDbug = document.querySelector('.debug');
		this.debugDiv = oldDbug ? oldDbug : document.createElement('div');
		this.debugDiv.classList.add('debug');
		document.body.appendChild(this.debugDiv);

		// prevent keypress if needed
		function preventKeypress(e) {
			if (!this.canKeyboardPress) {
				e.stopImmediatePropagation();
				e.preventDefault();
			}
		}
		document.addEventListener('keyup', preventKeypress.bind(this));
		document.addEventListener('keypress', preventKeypress.bind(this));

		// bind methods just in case
		// TODO - CONFIRM / CLARIFY 'just in case'
		this.start = this.start.bind(this);
		this.update = this.update.bind(this);
		this.getGameStates = this.getGameStates.bind(this);
		this.onContinueBtnPress = this.onContinueBtnPress.bind(this);
		this.onRetryBtnPress = this.onRetryBtnPress.bind(this);
		this.onQuitBtnPress = this.onQuitBtnPress.bind(this);
	}

	// =============================================================================
	// HANDLE DEBUG INFO CREATE
	// TODO - CREATE ONCE, CACHE DIV REF, UPDATE JUST DIV INNER
	updateDebugInfo() {
		this.debugDiv.innerHTML = '';
		const levelInfo = document.createElement('p');
		levelInfo.innerText = `Level: ${this.level}`;
		const enemyInfo = document.createElement('p');
		enemyInfo.innerText = `Enemy: ${this.enemyLeft} / ${this.enemyCount}`;
		const scoreInfo = document.createElement('p');
		scoreInfo.innerText = `High Score: ${this.scores}`;
		const infoElements = [levelInfo, enemyInfo, scoreInfo];
		infoElements.forEach((e) => {
			this.debugDiv.appendChild(e);
		});
	}

	// =============================================================================
	// HANDLE GAME PAUSE

	pause() {
		if (this.isEnterName) return; // ignore when enter name
		if (!this.isGame || this.isPaused) return;

		this.isPaused = true;

		// Cancel the current animation frame
		cancelAnimationFrame(this.animatedFrameId);

		// Pause all enemies
		this.enemyArray.forEach((e) => {
			if (e.isAlive) e.pause();
		});

		// hide words container
		this.gameView.hideWordContainer();

		// Show pause screen
		this.gameView.displayPause(this.highScore);
	}

	// =============================================================================
	// HANDLE GAME RESUME

	resume() {
		if (!this.isGame || !this.isPaused) return;

		this.isPaused = false;

		// Resume all enemies
		this.enemyArray.forEach((e) => {
			if (e.isAlive) e.resume();
		});

		// Hide pause screen
		this.gameView.hideScreenOverley();

		// show words container
		this.gameView.showWordContainer();

		//  Restart the game loop
		this.animationId = requestAnimationFrame(this.update);
	}

	// =============================================================================
	// HANDLE FIREWALL ATTACK

	onFirewallAttacked(from_str) {
		// NOTE - FIREWALL IS 1 MONSTER = 1 DAMAGE
		this.firewall.takeDamage(from_str);
		this.firewall.updateHpDisplay();
	}

	// =============================================================================
	// HANDLE MAINFRAME ATTACK

	onMainframeAttacked(enemy) {
		// [TEST GOD_MODE]
		if (this.GOD_MODE) {
			this.mainframe.takeDamage(0, enemy);
		} else {
			this.mainframe.takeDamage(enemy.attack(), enemy);
		}
		this.mainframe.updateHpDisplay();

		this.gameScreen.classList.remove('player-attack');
		this.gameScreen.classList.remove('on-hit');

		// force reflow
		void this.gameScreen.offsetWidth;
		this.gameScreen.classList.add('on-hit');
	}

	// =============================================================================
	// HANDLE PLAYER ATTACK
	// CALLED FROM gameplay.js

	onPlayerAttack(isHit = true) {
		// EARLY RETURNS
		if (!this.isGame) {
			return;
		}
		if (this.isPaused) {
			return;
		}

		// DO PLAYER ATTACK, BUT MISS
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
		this.gameScreen.classList.remove('on-hit');
		this.gameScreen.classList.remove('player-attack');
		// force reflow
		//void this.gameScreen.offsetWidth;
		this.gameScreen.classList.add('player-attack');

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
				const isFullyInside = enemyRect.left >= screenRect.left && enemyRect.right <= screenRect.right;

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
			scoreManager.removeCurrentCore();
		}
		// spawn mainframe
		this.mainframeDiv = this.mainframe.spawn();

		// spawn fireWall
		this.firewallDiv = this.firewall.spawn();

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
		this.enemeySpawnList.forEach((level) => {
			const enemy = new Enemy(this.gameScreen, `lv${level}`, this.levelEnemySpeed); // level 1
			enemy.spawn(this.gameScreen);
			this.enemyArray.push(enemy);
		});

		// set up gameview buttons
		const buttons = this.gameView.getButtons();

		// continue btn
		buttons.continue.addEventListener('click', this.onContinueBtnPress);
		document.addEventListener('keydown', this.onContinueBtnPress);

		// retry btn
		buttons.retry.addEventListener('click', this.onRetryBtnPress);
		document.addEventListener('keydown', this.onRetryBtnPress);

		// quit btn
		buttons.quit.addEventListener('click', this.onQuitBtnPress);
		document.addEventListener('keydown', this.onQuitBtnPress);
	}

	onContinueBtnPress(e) {
		if (this.isGame || !this.isWon) return;
		if (this.isEnterName) return; // ignore if entering name
		if (e?.key && e.key !== 'c') return;
		if (this.level >= this.MAX_LEVEL) return // ignore at max level
		document.removeEventListener('keydown', this.onContinueBtnPress);

		// start a new game, to the next level
		startNewGame(this.gameScreen, Number(this.level) + 1, this.difficulty, this.playerObject);
	}

	onRetryBtnPress(e) {
		if (this.isGame || this.isWon) return;
		if (this.isEnterName) return; // ignore if entering name
		if (e?.key && e.key !== 'r') return;
		document.removeEventListener('keydown', this.onRetryBtnPress);

		// start a new game with currnet level
		startNewGame(this.gameScreen, this.level, this.difficulty, this.playerObject);
	}

	onQuitBtnPress(e) {
		if (this.isGame && !this.isPaused) return;
		if (this.isEnterName) return; // ignore if entering name
		if (e?.key && e.key !== 'q') {
			return;
		} else {
			e.preventDefault();
		}

		// if no score, leave game
		if (this.highScore <= 0) {
			// back to home page
			setTimeout(() => {
				window.location.href = 'index.html#leaderboard';
			}, 700);
			return;
		}

		// else, enter name mode turn
		this.isEnterName = true;
		this.gameView.displayNameInput();

		const nameInput = this.gameView.nameInput;
		const nameMessage = this.gameView.nameInputMessage;
		const nameBtn = this.gameView.nameInputBtn;
		nameMessage.innerText = '';
		nameInput.focus();
		document.removeEventListener('keydown', this.onQuitBtnPress);

		function onNameEnter() {
			try {
				// check name
				let name = nameInput.value.trim();
				if (name === '') throw new Error('Missing initials');
				if (name.length !== 3) throw new Error('must be 3 letters');

				// CAP the name
				name = name.toUpperCase();

				// check for bad name
				flaggedNames.forEach((flag) => {
					if (name === flag) {
						throw new Error('Flagged initials');
					}
				});

				// all score data is already saved in game over check
				// store player name to current score
				scoreManager.setCurrentScoreName(name);
				// push to local scores array
				scoreManager.addToHighScores();

				nameMessage.innerText = 'saving...';

				// remove listeners
				document.removeEventListener('click', onNameEnter);
				document.removeEventListener('keydown', onNameEnter);

				// back to home page
				setTimeout(() => {
					window.location.href = 'index.html#leaderboard';
				}, 1000);
			} catch (err) {
				nameMessage.innerText = err.message;
			}
		}
		// Add Event Listeners
		nameBtn.addEventListener('click', onNameEnter);
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				onNameEnter();
			}
		});
	}

	// Main game loop
	update(timestamp) {
		// check is game running
		if (!this.isGame || this.isPaused) {
			return;
		}

		// check is game over
		this.checkGameOver();

		// game debug info
		// if (this.isDebugMode) {
		//   this.updateDebugInfo()
		// }

		// wait for player to port in
		if (this.player.currentState != this.player.states.READY) {
			// next frame
			this.animatedFrameId = requestAnimationFrame(this.update);
			return;
		} else {
			if (!this.canKeyboardPress) {
				this.canKeyboardPress = true;
				// show word container
				this.gameView.showWordContainer();
			}
		}

		// Check delta time
		if (!this.lastTimestamp) {
			this.lastTimestamp = timestamp;
		}
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

		// DO IT ONCE BEFORE ALL ENEMY UPDATES
		const gameScreenRect = this.gameScreen.getBoundingClientRect();
		const gameScreenScale = (gameScreenRect.width / 352.0).toFixed(1);
		// console.log(`[GAME][HIT EVAL] GAME SCREEN SCALE(${gameScreenScale})`);

		const mainframeRectX = Math.floor(this.mainframeDiv.getBoundingClientRect().right);
		// console.log(`[GAME][HIT EVAL] MAINFRAME RECTX(${mainframeRectX})`);

		const firewall_x_thresh = (this.firewallDiv.getBoundingClientRect().left + this.firewallDiv.getBoundingClientRect().right) * 0.5;

		// EVAL X POS TO check for enemey collision
		for (let i = 0; i < this.enemyArray.length; i++) {
			// GET ENEMY TO EVAL
			const enemy = this.enemyArray[i];

			// SKIP DEAD ENEMIES
			if (!enemy.isAlive) {
				continue;
			}

			// GET SCALED SCREEN ENEMY X
			// NOTE - THIS IS SCREEN X AFTER THE SCALING TRANSFORM
			// THUS - IT DOESN'T MATCH THE PIXEL COORDS
			const enemyLocationX = enemy.getLocationX();

			// GET PIXEL COORDS
			const enemyPixelX = Math.floor(enemyLocationX / gameScreenScale);
			const enemyPixelY = enemy.getLocationY();
			// console.log(`[MAINFRAME][HIT EVAL] ENEMY PIXEL X,Y(${enemyPixelX}, ${enemyPixelY})`);

			// WIP OPTIMIZATION - DON'T EVEN CHECK IF X ISN'T PAST HALF SCREEN
			// 352 / 2 = 176
			// NOTE - WON'T WORK IF SCREEN COORDS AFFECTED BY SCALE
			// if (enemyPixelX > 216) {
			//				continue;
			//			}

			// EVAL enemy reaching firewall
			// V2DO - CALC AND CACHE THE FIREWALL BOUNDS LIKE THE MAINFRAME
			if (this.firewallDiv && this.firewall.isAlive) {
				if (enemyLocationX - firewall_x_thresh <= 0) {
					this.onFirewallAttacked(enemy.name);

					// MURDER THE ENEMY
					enemy.doEnemyDie('firewall');
					continue;
				}
			}

			// EVAL enemy reaching mainframe
			// V2DO - ENEMIES CONTINUE TO 'DIE & ABSORB INTO THE MAINFRAME'
			if (this.mainframeDiv) {
				// V2DO - FINISH THE PIXEL SLANT CALCS
				let use_pixel_calcs = false;

				if (use_pixel_calcs) {
					// GET SCALED DIFF
					// console.log(`[MAINFRAME][HIT EVAL] PIXEL CALCS`);

					let hit_x_diff = enemyLocationX - mainframeRectX;
					// console.log(`[MAINFRAME][HIT EVAL] hit_x_diff(${hit_x_diff})`);

					// !!!! INSTEAD OF SCALING DOWN, SCALE THE OFFSET UP!
					if (enemyPixelY < 72) {
						// NOTE - ADJUSTS 'INSET' CALC BASED ON ENEMY Y
						// RISE/RUN 1:2 THUS, FOR EVERY
						// FURTHEST 'Z VALUE' IS 0 ADJ OFFSET  MF Y 72
						// CLOSED 'Z VALUE' IS -24 ADJ OFFSET  MF Y 120

						// CALC IF ENEMYPIXELX HAS PASSED INTO THE MAINFRAME SPRITE

						// ADJUST IF ENEMY IS LOW ENOUGH FOR SLANT
						// SET LOCATION Y
						//   72 GOAL IS -0
						//   80 GOAL IS -8
						//   96 GOAL IS -12
						//  112 GOAL IS -20
						// console.log(`[MAINFRAME][HIT EVAL] ENEMY PIXEL Y ADJ (${enemyPixelY})`);

						// EG: enemy 96
						let rise_run_x_adj = enemyPixelY;
						//console.log(`[MAINFRAME][HIT EVAL] rise_run_x_adj(${rise_run_x_adj})`);

						// DIVIDE IN HALF TO GET VERTICAL RISE:RUN 1:2 0.5
						// EG: enemy 24 /2 = 12
						rise_run_x_adj /= 2;
						//console.log(`[MAINFRAME][HIT EVAL] rise_run_x_adj(${rise_run_x_adj})`);

						// SCALE IT
						rise_run_x_adj *= gameScreenScale;
						//console.log(`[MAINFRAME][HIT EVAL] rise_run_x_adj(${rise_run_x_adj})`);

						// ADD THE ADJ
						hit_x_diff += rise_run_x_adj;
						//console.log(`[MAINFRAME][HIT EVAL] hit_x_diff ADJ(${hit_x_diff})`);
					}

					// FINALLY, EVAL IF ENEMY HIT MAINFRAME
					if (hit_x_diff <= 0) {
						//console.log(`[MAINFRAME][HIT EVAL][${enemy.name}] COLLIDED WITH MAINFRAME PIX`);
						this.onMainframeAttacked(enemy);
					}
				} else {
					// USE LU's RELIABLE BOUNDING BOX CALCS
					let hit_x_diff = enemyLocationX - mainframeRectX;
					const offset_add = 12 * gameScreenScale;

					// JUST CAN'T STOP THIS DANG SLANT LOGIC!!
					if (enemyPixelY < 32) {
						hit_x_diff += offset_add;
					}

					if (enemyPixelY < 48) {
						hit_x_diff += offset_add;
					}

					if (enemyPixelY < 64) {
						hit_x_diff += offset_add;
					}

					if (enemyPixelY < 72) {
						hit_x_diff += offset_add;
					}

					// FINALLY, EVAL IF ENEMY HIT MAINFRAME
					if (hit_x_diff <= 0) {
						console.log(`[MAINFRAME][HIT EVAL][${enemy.name}] COLLIDED WITH MAINFRAME LU`);
						this.onMainframeAttacked(enemy);
					}
				}
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
			// store current points
			this.saveToLocalStorage();

			// set game state
			this.isGame = false;
			this.isWon = true;

			// prevent keypress
			this.canKeyboardPress = false;

			// hide words container
			this.gameView.hideWordContainer();

			// STOP LEVEL MUSIC
			gameAudio.stopMusic();

			// WIN MUSIC
			gameAudio.playWinMusic();

			// V2DO - PLAY CELEBRATE LOOP
			// WAIT A MOMENT FOR MUSIC AND TO PREVENT TYPING FROM MOVING FORWARD WITH NEXT LEVEL
			setTimeout(() => {
				// enable keypress
				this.canKeyboardPress = true;

				// display win 
				const isMaxLevel = this.level >= this.MAX_LEVEL
				this.gameView.displayWin(this.highScore, isMaxLevel);

			}, 1400);
			return;
		}

		// lose
		if (this.mainframe.hp <= 0) {
			// set game state
			this.isGame = false;

			// prevent keypress
			this.canKeyboardPress = false;

			// Cancel the current animation frame
			cancelAnimationFrame(this.animatedFrameId);

			// Pause all enemies
			this.enemyArray.forEach((e) => {
				if (e.isAlive) e.pause();
			});

			// hide words container
			this.gameView.hideWordContainer();

			// STOP BG MUSIC
			gameAudio.stopMusic();

			// LOSE MUSIC
			gameAudio.playLoseMusic();

			// player exit animation
			// V2DO - MOVE VERTICALLY, TALLER SPRITE
			this.player.exit(false);

			// player is out, display win screen
			// NOTE - TIMEOUT IS TIED TO PLAYER SPRITE DURATION
			console.log(`[GAME][LOSE] WAITING FOR PLAYER ANIM OUT (${this.player.sprites.exit.duration}ms)`);

			setTimeout(() => {
				// enable keypress
				this.canKeyboardPress = true;

				// display lose screen
				this.gameView.displayLose(this.highScore);
			}, this.player.sprites.exit.duration + 1000);
			return;
		}
	}

	saveToLocalStorage() {
		// save scores
		scoreManager.addToCurrentScore(this.scores);
		// save level
		localStorage.setItem('level', this.level);
		// save difficulty
		localStorage.setItem('difficulty', this.difficulty);
		// save language
		localStorage.setItem('pickedLanguages', JSON.stringify(this.languages));

		// update gameStates
		this.getGameStates();
	}
	getGameStates() {
		// return everything about the current game
		const LANGUAGES_KEY = 'pickedLanguages';

		this.languages = JSON.parse(localStorage.getItem(LANGUAGES_KEY) || '[]');
		this.highScore = scoreManager.getCurrentScore().score;

		// TODO - ???? Check for valid language here?
		const gameStates = {
			level: this.level,
			difficulty: this.difficulty,
			languages: this.languages,
			highScore: this.highScore,
			enemyCount: this.enemyCount,
			enemySpawnTime: this.enemySpawnTime,
			levelEnemySpeed: this.levelEnemySpeed,
		};
		return gameStates;
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
		this.canKeyboardPress = false;
		this.getGameStates(); // update game states
		// concent gameAudio
		gameAudio.setConsent();

		// hide words container
		this.gameView.hideWordContainer();

		// play backgronud music
		gameAudio.playBackgroundMusic(false);

		// Run game
		requestAnimationFrame(this.update);
	}
	setGODMODE(isGOD = false) {
		this.GOD_MODE = isGOD
	}
}

// Start new game: create a new game instance
let currentGame = null;

export function startNewGame(gameScreen, level = 1, difficulty = 'easy', playerObject = null) {
	console.log(`[GAME][STARTNEW] WITH GAME SCREEN[${gameScreen.id}] LEVEL[${level}] DIFFICULTY[${difficulty}] PLAYEROBJ[${playerObject}]`);

	// CANCEL ANIM IF GAME ALREADY IN PROGRESS
	if (currentGame && currentGame.animatedFrameId) {
		console.log(`[GAME][STARTNEW] CANCELLING ANIM FRAME`);
		cancelAnimationFrame(currentGame.animatedFrameId);
	}

	// if this is the first game remove current scores
	if (!currentGame) {
		console.log(`[GAME][STARTNEW] REMOVING CURRENT SCORE`);
		scoreManager.removeCurrentCore();
	}

	// Create a new game instance
	console.log(`[GAME][STARTNEW] CREATING NEW INSTANCE`);
	currentGame = new Game(gameScreen, level, difficulty, playerObject);

	// init gameplay using temp-gameplay
	console.log(`[GAME][STARTNEW] INITIALIZING GAMEPLAY LOGIC`);
	initializeGameLogic(currentGame);
}
