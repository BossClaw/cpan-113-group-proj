import { gameAudio } from '../audio/gameAudio.js';
import { enemyDictionary } from './enemyDictionary.js';

// gameScreen is the #game_screen div
// speed is calculated by game's difficult, game's level and enemy's own speed
export class Enemy {
	static nextId = 1;

	constructor(gameScreen, enemyKey = 'lv1', gameSpeed = 1) {
		this.id = Enemy.nextId++;

		// base info
		this.gameScreen = gameScreen;
		this.enemyData = enemyDictionary[enemyKey] || enemyDictionary['lv1'];

		// RESET THE DIVS
		this.outerDiv = null;
		this.innerDiv = null;

		// state
		this.isAlive = true;
		this.name = this.enemyData.name;
		this.hp = this.enemyData.hp;
		this.speed = this.enemyData.speed * gameSpeed;
		this.damage = this.enemyData.damage;

		// movement
		this.isMoving = false;
		this.defaultMovementDuration = 3;
		this.actualMovementDuratrion = this.defaultMovementDuration / this.speed;

		// test info
		this.enemyInfo = null;

		// bind methods
		this.spawn = this.spawn.bind(this);
		this.move = this.move.bind(this);
		this.takeDamage = this.takeDamage.bind(this);
		this.destroy = this.destroy.bind(this);
		this.attack = this.attack.bind(this);
	}

	// SPAWN ON THE GAME VIEW
	spawn() {
		// CALC AND SET IT'S XY
		const x = this.gameScreen.offsetWidth;
		const yRange = this.enemyData.yMax - this.enemyData.yMin;
		const yPos = Math.floor(Math.random() * yRange);

		this.y = this.enemyData.yMin + yPos;
		// V2DO - 'DIVIDE THEN MULTIPLY BY 2(?)' TO VERTICALLY 'SPACE OUT'
		this.y = Math.floor(this.y / 4) * 4;
		// console.log(`[ENEMY][SPAWN][${this.enemyData.name}] yMin(${this.enemyData.yMin}) yMax(${this.enemyData.yMax}) yRange(${yRange}) yPos(${yPos}) y(${y})`);

		// Create outer div
		this.outerDiv = document.createElement('div');
		this.outerDiv.classList.add('enemy');
		this.outerDiv.classList.add('enemy_outer');

		this.outerDiv.style.left = `${x}px`;
		this.outerDiv.style.bottom = `${this.y}px`;

		// css animaiton speed to move across game view
		this.outerDiv.style.animationDuration = this.defaultMovementDuration / this.speed + 's';

		// DYN z-index FOR DEPTH LAYERING
		let z_val = 160;
		z_val = z_val - this.y;
		// console.log(`[ENEMY][SPAWN][${this.enemyData.name}] z_val(${z_val})`);
		this.outerDiv.style.zIndex = '' + z_val;

		// APPLY DATA TO OUTER DIV
		// ADD NAME FOR DEBUGGING
		this.outerDiv.dataset.name = this.enemyData.name;

		// Create inner div
		this.innerDiv = document.createElement('div');
		this.innerDiv.classList.add('enemy');
		this.innerDiv.classList.add('enemy_inner');
		this.innerDiv.classList.add(`enemy-${this.enemyData.name}`);

		// ADD EXTRA CLASSES IF PROVIDED
		if (this.enemyData.classes_arr) {
			this.innerDiv.classList.add(...this.enemyData.classes_arr);
			// console.log(`[ENEMY][SPAWN][${this.enemyData.name}] CLASSES_ARR[${this.enemyData.classes_arr}] NEW CLASS_LIST[${this.innerDiv.classList}]`);
		}

		// ADD BG SPRITE VIZ CLASS
		let bg_str = `url("gameplay/enemy/img/${this.name}.gif")`;
		this.innerDiv.style.backgroundImage = bg_str;

		// ADD A RAND ANIM START TO PREVENT 'ALL SPAWN AT SAME TIME'
		// TBD - DUR IS LONGEST, BUT NOT TOO IMPORTANT SINCE IT'S ALL LOOPING
		const duration = 3.5;
		const randomOffset = `${(Math.random() * duration * -1.0).toFixed(1)}s`;
		// console.log(`[ENEMY][SPAWN][${this.enemyData.name}] RANDOM ANIM OFFSET[${randomOffset}]`);
		this.innerDiv.style.animationDelay = randomOffset;

		// put it on screen
		this.outerDiv.appendChild(this.innerDiv);
		this.gameScreen.appendChild(this.outerDiv);

		// (testing) show enemy info
		// this.enemyInfo = document.createElement("div");
		// this.enemyInfo.classList.add("enemy-info");
		// this.outerDiv.appendChild(this.enemyInfo);
		// this.updateInfo();

		return this.outerDiv;
	}
	updateInfo() {
		// this.enemyInfo.innerText = `HP: ${this.hp}`;
	}
	move() {
		// only call 'move' once at the start
		this.outerDiv.classList.add('move');
	}
	pause() {
		this.outerDiv.classList.add('stop');
	}
	resume() {
		this.outerDiv.classList.remove('stop');
	}

	getLocationX() {
		return this.outerDiv.getBoundingClientRect().left;
	}

	getLocationY() {
		// STORED ON SPAWN
		return this.y;
	}

	takeDamage(amount) {
		this.hp -= amount;

		this.doHitViz();

		// play SFX
		gameAudio.playEnemyHit();

		// die
		if (this.hp <= 0) {
			this.doEnemyDie('TAKE DAMAGE');
		}
	}

	doEnemyDie(from_str) {
		console.log(`[ENEMY][${this.name}] DIES FROM[${from_str}]!`);
		this.destroy();
	}

	attack() {
		this.takeDamage(this.damage);
		return this.damage;
	}

	destroy() {
		// removing 'move' will make the enemy get back to original location, so we need to keep this location
		this.outerDiv.classList.add('stop');
		this.outerDiv.classList.add('animate__animated', 'animate__slideOutRight', 'animate__faster');
		this.outerDiv.style.animationDuration = '0.2s';

		// CLEAR, ADD, WAIT, REMOVE
		this.doHitViz();

		// is dead
		this.isAlive = false;

		setTimeout(() => {
			this.outerDiv.remove();
		}, 600);
	}

	doHitViz() {
		// V2DO - MOVE A HIT DIV FROM A POOL OF HITS TO THE LOCATION ON SCREEN WITH +1 z-index

		this.innerDiv.classList.add('hit');

		setTimeout(() => {
			this.innerDiv.classList.remove('hit');
		}, 700);
	}
}
