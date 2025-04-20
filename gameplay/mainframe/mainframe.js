import { gameAudio } from '../audio/gameAudio.js';

export class Mainframe {
	constructor(gameScreen) {
		console.log('[GAME][MAINFRAME] CREATING MAINFRAME');

		// STORE GAME SCREEN
		this.gameScreen = gameScreen;

		// divs
		this.outerDiv = null;
		this.innerDiv = null;

		// stats
		this.max_hp = 16.0;
		// DEV TESTING
		//this.max_hp = 1600;
		this.hp = this.max_hp;
		this.isAlive = true;

		// TESTING
		this.show_hp = false;
	}

	spawn() {
		if (!this.gameScreen) {
			console.warn('[MAINFRAME] missing game screen');
			return;
		}

		// Create outer div
		this.outerDiv = document.createElement('div');
		this.outerDiv.classList.add('mainframe');
		this.outerDiv.classList.add('mainframe_outer');

		// Create inner div
		this.innerDiv = document.createElement('div');
		this.innerDiv.classList.add('mainframe');
		this.innerDiv.classList.add('mainframe_inner');

		// ADD INNER TO OUTER
		this.outerDiv.appendChild(this.innerDiv);

		// put it on screen
		this.gameScreen.appendChild(this.outerDiv);

		// (testing) show hp
		if (this.show_hp) {
			this.hpDisplay = document.createElement('div');
			this.hpDisplay.classList.add('mainframe-hp');
			this.innerDiv.appendChild(this.hpDisplay);
			this.hpDisplay.innerText = this.hp;
		}
		return this.outerDiv;
	}

	// (testing)
	updateHpDisplay() {
		if (this.show_hp) {
			this.hpDisplay.innerText = this.hp;
		}
	}

	// HANDLE COLLISION
	takeDamage(damage = 1, enemy) {
		// SKIP ANY FURTHER DAMAGE CALCS, BUT STILL SHOW HIT/ABSORB
		if (!this.is_dead) {
			// SUBTRACT DAMAGE
			this.hp -= damage;

			// UPDATE VIZ BASED ON DAMAGE
			this.changeDamageStage();

			// SFX
			gameAudio.playMainframeHit();

			// HANDLE DEATH/CORRUPTION VIZ/ANIM
			if (this.hp <= 0) {
				this.is_dead = true;
				return;
			}
		}

		// DESTROY ENEMY ON HIT
		if (enemy) {
			enemy.doEnemyDie('mainframe');
		}

		this.doHitViz();
	}

	changeDamageStage() {
		// DAMAGE IS NOW A PERC 0.0..1.0
		let corruption_perc = 1.0 - this.hp / this.max_hp;

		let anim = 'mainframe_000.gif';

		if (corruption_perc < 0.25) {
			anim = 'mainframe_000.gif';
		} else if (corruption_perc < 0.5) {
			anim = 'mainframe_025.gif';
		} else if (corruption_perc < 0.75) {
			anim = 'mainframe_050.gif';
		} else if (corruption_perc < 1.0) {
			anim = 'mainframe_075.gif';
		} else {
			anim = 'mainframe_100.gif';
		}

		console.log(`[MAINFRAME] CORRUPTION(${corruption_perc}) ANIM[${anim}]`);

		// APPLY
		// this.innerDiv.style.backgroundColor = color;

		// url('mainframe_000.gif');
		this.innerDiv.style.backgroundImage = `url('./gameplay/mainframe/${anim}')`;
	}

	destroy() {
		this.isAlive = false;

		// NOTE - FULL CORRUPTION DISPLAY IS HANDLED IN HIT

		this.innerDiv.classList.remove('hit');

		void this.innerDiv.offsetWidth;
	}

	doHitViz() {
		// V2DO - MOVE A HIT DIV FROM A POOL OF HITS TO THE LOCATION ON SCREEN WITH +1 z-index
		this.innerDiv.classList.add('hit');
		setTimeout(() => {
			this.innerDiv.classList.remove('hit');
		}, 700);
	}
}
