// Background
const bgMusic = [
	'gameplay/audio/music/Phat_Phrog_Studio_Binary_Bushido_Bionic_Bound_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studio_Binary_Bushido_Mecha_Maiden_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studio_Binary_Bushido_Ronin_Maelstrom_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studio_Binary_Bushido_Shogun_Struggle_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studio_Phantom_Samurai_Katana_Clash_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studio_Phantom_Samurai_Ronin_Resurgence_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studio_Phantom_Samurai_Steel_Ronin_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studio_Replicant_Rebellion_Machine_Soul_LOOP.mp3',
	'gameplay/audio/music/Phat_Phrog_Studios_8bit_Blip.mp3',
];

// win / lose fanfares
const winMusic = ['gameplay/audio/music/Retro_Victory_1.wav', 'gameplay/audio/music/Retro_Victory_2.wav'];
const loseMusic = ['gameplay/audio/music/Retro_Defeat_3.wav', 'gameplay/audio/music/Retro_Defeat_5.wav'];

// mainframe
// V2DO - SPECIFIC MAINFRAME CORRUPTION AUDIO
const mainframeHit = ['gameplay/audio/sfx/enemy_disintegrate_md.wav', 'gameplay/audio/sfx/enemy_hit_md.wav'];
const mainframeDie = ['gameplay/audio/sfx/mainframe_collapse.wav'];

// firewall
const firewallHit = ['gameplay/audio/sfx/enemy_disintegrate_md.wav', 'gameplay/audio/sfx/enemy_hit_md.wav'];
const firewallDie = ['gameplay/audio/sfx/mainframe_hit_a.wav'];

// enemy
// V2DO - UNIQUE ENEMY HIT / DIE SOUNDS IN ENEMY DICTIONARY
const enemyHit = ['gameplay/audio/sfx/enemy_distintegrate_lo.wav', 'gameplay/audio/sfx/enemy_disintegrate_md.wav', 'gameplay/audio/sfx/enemy_hit_md.wav'];
const enemyDie = ['gameplay/audio/sfx/mainframe_hit_a.wav'];

// player
// V2DO SPECIFIC PLAYER AUDIO
const playerAttack = ['gameplay/audio/sfx/enemy_hit_hi.wav'];
const playerMissed = ['gameplay/audio/sfx/player_reload.wav'];

// =========================================================================
// GAME AUDIO CLASS

class GameAudio {
	constructor() {
		// user need to click on something to consent play audio
		// this will be the start game "Enter" button
		// Game class will trigger it, and let GameAudio know
		// ***** interaction NEED to trigger Audio.play() at least 1 time
		this.playerConsent = false;

		// V2DO - ENABLE MUSIC/SFX VOLUME SETTINGS
		this.musicVolume = 0.3;
		this.sfxVolume = 0.5;

		this.audioCacheMap = new Map(); // audio instance
		this.audioIndexMap = new Map(); // current index of each list

		// only 1 music at a time
		// V2DO - STORE MUSIC IN LOCALSTORAGE(?) SO OSC MUTE PLAYS CORRECT MUSIC
		this.currentMusic = null;

		// bin
		this.toggleMusic = this.toggleMusic.bind(this);
	}

	setConsent(consent = true) {
		// call in class  game "Enter" game button
		this.playerConsent = consent;
	}

	setMusicVolume(volume = 0.5) {
		this.musicVolume = Math.max(0, Math.min(1, volume)); // clamp it
	}

	setSFXVolume(volume = 0.5) {
		this.sfxVolume = Math.max(0, Math.min(1, volume)); // clamp it
	}

	// ===============================================================
	// MUSIC HANDLING

	stopMusic() {
		if (!this.currentMusic) {
			return;
		}
		this.currentMusic.pause();
		this.currentMusic.currentTime = 0;
		this.currentMusic = null;
	}

	toggleMusic() {
		if (!this.currentMusic) {
			return;
		}

		if (this.currentMusic.paused) {
			this.currentMusic.play().catch(console.warn);
		} else {
			this.currentMusic.pause();
		}
	}

	setMusicPaused(be_paused) {
		// RETURN IF NONE
		if (!this.currentMusic) {
			return;
		}

		console.log(`[GAMEAUDIO] SETTING MUSIC PAUSED(${be_paused})`);

		// PLAY IF PAUSED
		if (!be_paused && this.currentMusic.paused) {
			this.currentMusic.play().catch(console.warn);
			return;
		}

		// UNPAUSE IF PAUSED
		if (be_paused && !this.currentMusic.paused) {
			this.currentMusic.pause();
			return;
		}
	}

	// ===============================================================
	// PLAY THAT HANDLES ALL PLAY REQUESTS

	play(path, isMusic = false, loop = false) {
		if (!this.playerConsent) {
			return;
		}

		// check localstorage audio muted
		// V2DO - USE ABSTRACT game_settings.js
		const isMuted = localStorage.getItem('aud_muted');
		if (isMuted && isMuted === 'true') {
			return;
		}

		// find audio from cache or / create audio
		let audio;

		if (this.audioCacheMap.has(path)) {
			audio = this.audioCacheMap.get(path).cloneNode(); // to allow multiple play
		} else {
			const original = new Audio(path);
			this.audioCacheMap.set(path, original);
			audio = original.cloneNode();
		}

		// Set volume and loop
		// V2DO - SET SLIGHT AUDIO VARIANCE, SPEED & PITCH IF POSSIBLE
		audio.volume = isMusic ? this.musicVolume : this.sfxVolume;
		audio.loop = loop;

		// Stop current music before playing new one
		if (isMusic && loop) {
			this.stopMusic();
			this.currentMusic = audio;
		}

		// remove after played
		audio.addEventListener('ended', () => {
			audio.removeAttribute('src');
			audio.load();
		});

		// play
		audio.play().catch((err) => {
			console.warn(`[AUDIO] failed to play: ${path}`, err);
		});
	}

	playFromList(list, isRandom = false, isMusic = false, loop = false) {
		if (!this.playerConsent || !list.length) {
			return;
		}

		let path;

		if (isRandom) {
			const index = Math.floor(Math.random() * list.length);
			path = list[index];
		} else {
			let index = this.audioIndexMap.get(list); // use array as key
			if (index == null) index = 0;

			path = list[index];
			this.audioIndexMap.set(list, (index + 1) % list.length); // loop
		}
		this.play(path, isMusic, loop); // call play method
	}

	//--------- sound method for other classes -------
	// -------- Music----------

	playBackgroundMusic(isRandom) {
		this.playFromList(bgMusic, isRandom, true, true);
	}

	playWinMusic() {
		this.playFromList(winMusic, true, true);
	}

	playLoseMusic() {
		this.playFromList(loseMusic, true, true);
	}

	// --------- SFX ----------
	// MAINFRAME

	playMainframeHit(isRandom) {
		this.playFromList(mainframeHit, isRandom);
	}

	playMainframeDie(isRandom) {
		this.playFromList(mainframeDie, isRandom);
	}

	// Firewall
	playFirewallHit(isRandom) {
		this.playFromList(firewallHit, isRandom);
	}
	playFirewallDie(isRandom) {
		this.playFromList(firewallDie, isRandom);
	}

	// Enemy
	playEnemyHit(isRandom) {
		this.playFromList(enemyHit, isRandom);
	}

	// player
	playPlayerAttack(isRandom) {
		this.playFromList(playerAttack, isRandom);
	}

	playPlayerMissed(isRandom) {
		this.playFromList(playerMissed, isRandom);
	}

	// ==========================================================================
	// UI

	play_ui_set() {
		this.play('gameplay/audio/ui/menu_set.wav');
	}

	play_ui_unset() {
		this.play('gameplay/audio/ui/menu_unset.wav');
	}
}

// ==========================================================================
// CREATE THE GAMEAUDIO INSTANCE ON SCRIPT LOAD

const gameAudio = new GameAudio();

// MAKE AVAIL TO IMPORTS
export { gameAudio };
