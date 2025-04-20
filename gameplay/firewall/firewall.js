import { gameAudio } from '../audio/gameAudio.js';

export class Firewall {
	constructor(gameScreen) {
		this.gameScreen = gameScreen;
		// location/styles
		this.outerClass = 'firewall';
		this.innerClass = 'firewall-sprit';

		// POSITION
		this.locationX = 100;
		this.locationY = 0;

		// divs
		this.outerDiv = null;
		this.innerDiv = null;

		// stats
		this.max_hp = 4.0;
		this.hp = this.max_hp;
		this.isAlive = true;
	}
	spawn() {
		if (!this.gameScreen) {
			console.warn('missing game screen');
			return;
		}

		// Create outer div
		this.outerDiv = document.createElement('div');
		this.outerDiv.classList.add(this.outerClass);

		this.outerDiv.style.position = 'absolute';
		this.outerDiv.style.left = `${this.locationX}px`;
		this.outerDiv.style.top = `${this.locationY}px`;

		// Create inner div
		this.innerDiv = document.createElement('div');
		this.innerDiv.classList.add(this.innerClass);
		this.outerDiv.appendChild(this.innerDiv);

		// put it on screen
		this.gameScreen.appendChild(this.outerDiv);

		// (testing) show hp
		this.show_hp = false;

		if (this.show_hp) {
			this.hpDisplay = document.createElement('div');
			this.hpDisplay.classList.add('mainframe-hp');
			this.innerDiv.appendChild(this.hpDisplay);
			this.hpDisplay.innerText = this.hp;
		}

		// UPDATE VIZ
		this.updateViz();

		return this.outerDiv;
	}

	// (testing)
	updateHpDisplay() {
		if (this.show_hp) {
			this.hpDisplay.innerText = this.hp;
		}
	}

	getLocationX() {
		// TODO - CACHE THIS
		return this.outerDiv.getBoundingClientRect().right;
	}

	takeDamage(from_str) {
		// TODO - ENSURE NOT TOO MANY ENEMIES 'STACK'
		// EARLY IN CASE ALREAD DEAD BY NOT DESTROYED
		if (this.hp <= 0.0) {
			return;
		}

		// SUBTRACT 1 HIT
		// 1 ENEMY = 1 DAMAGE
		this.hp -= 1.0;

		console.warn(`[FIREWALL] DAMAGED HP(${this.hp}) FROM[${from_str}] TIME[${Date.now()}]`);

		// UPDATE DAMAGE VIZ
		this.updateViz();

		// SFX
		gameAudio.playFirewallHit(true);
		
		// ADD HIT
		this.doHitViz();

		// HANDLE DESTROY VIZ/AUD
		if (this.hp <= 0) {
			console.log(`[FIREWALL] DESTROYED!!!`);
			// TODO - UNIQUE DESTROY NOISE / VIZ
			this.destroy();
			return;
		}
	}

	updateViz() {
		// DYNAMICALLY ALTER HP, SO USE MAX LIKE THE MAINFRAME
		// 2.0 / 4.0 = 0.5
		let hp_progress = this.hp / this.max_hp;

		let firewall_img = 'firewall_100.png';

		if (hp_progress >= 1.0) {
			firewall_img = 'firewall_100.png';
		} else if (hp_progress >= 0.75) {
			firewall_img = 'firewall_075.png';
		} else if (hp_progress >= 0.5) {
			firewall_img = 'firewall_050.png';
		} else if (hp_progress >= 0.25) {
			firewall_img = 'firewall_025.png';
		} else {
			firewall_img = 'firewall_000.png';
		}

		console.warn(`[FIREWALL] CUR HP(${this.hp}) PROGRESS(${hp_progress}) MADE URL[${firewall_img}]`);

		// APPLY IT
		this.innerDiv.style.backgroundImage = `url('gameplay/firewall/${firewall_img}')`;
	}

	destroy() {
		// SFX
		gameAudio.playFirewallDie();

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
