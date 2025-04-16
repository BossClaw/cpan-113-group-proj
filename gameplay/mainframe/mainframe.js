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
		this.hp = 8;

		// DEV TESTING
		this.hp = 16;
		this.isAlive = true;
	}

	spawn() {
		if (!this.gameScreen) {
			console.warn('missing game screen');
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
		this.hpDisplay = document.createElement('div');
		this.hpDisplay.classList.add('mainframe-hp');
		this.innerDiv.appendChild(this.hpDisplay);
		this.hpDisplay.innerText = this.hp;

		return this.outerDiv;
	}

	// (testing)
	updateHpDisplay() {
		this.hpDisplay.innerText = this.hp;
	}

	getLocationX() {
		return this.outerDiv.getBoundingClientRect().right;
	}

	takeDamage(damage = 1) {
		
		// SKIP ANY FURTHER DAMAGE
		if (this.is_dead)
		{
			return;
		}

		this.hp -= damage;
		// dmage stage
		if (this.hp > 8) {
			this.changeDamageStage(0);
		} else if (this.hp > 6) {
			this.changeDamageStage(1);
		} else if (this.hp > 3) {
			this.changeDamageStage(2);
		} else {
			this.changeDamageStage(3);
		}

		// HANDLE DEATH INTERRUPT
		if (this.hp <= 0) {
			this.is_dead = true;
			this.destroy();
			return;
		}

		// SFX
		gameAudio.playMainframeHit();

		// change sprit image / color based on damage taken
		// .... logic here ...
		this.innerDiv.classList.remove('hit');

		void this.innerDiv.offsetWidth; // Trigger reflow

		this.innerDiv.classList.add('hit');
	}

	changeDamageStage(stage = 0) {
		// 0 = default, increase stage as damaged
		const maxStage = 3;
		const damageStage = Math.min(maxStage, Math.max(0, stage));

		let color = '#FFFFFF';

		switch (damageStage) {
			case 0:
				color = '#FFFFFF';
				break;
			case 1:
				color = '#FFCCCC';
				break;
			case 2:
				color = '#FF6666';
				break;
			case 3:
				color = '#FF3333';
				break;
		}
		this.innerDiv.style.backgroundColor = color;
	}

	destroy() {
		this.isAlive = false;

		// change sprit image / color to destroyed
		// .... logic here ...

		this.innerDiv.classList.remove('hit');
		this.innerDiv.classList.add('destroyed');

		void this.innerDiv.offsetWidth;
	}
}
