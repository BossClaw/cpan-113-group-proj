// Background
const bgMusic = [
  "gameplay/audio/music/1_Phat_Phrog_Studio_Cyber_Attack_Steel_Shadows_LOOP.mp3",
  "gameplay/audio/music/1_Phat_Phrog_Studio_Phantom_Samurai_Ronin_Resurgence_LOOPED.mp3",
  "gameplay/audio/music/2_Phat_Phrog_Studio_Binary_Bushido_Ronin_Maelstrom_LOOP.mp3",
  "gameplay/audio/music/2_Phat_Phrog_Studio_Replicant_Rebellion_Fractured_Galaxy_LOOP.mp3",
  "gameplay/audio/music/3_Phat_Phrog_Studio_Binary_Bushido_Mecha_Maiden_LOOP.mp3",
  "gameplay/audio/music/5_Phat_Phrog_Studio_Binary_Bushido_Shogun_Struggle_LOOP.mp3",
  "gameplay/audio/music/5_Phat_Phrog_Studio_Cyber_Attack_Shattered_Circuits_LOOP.mp3",
  "gameplay/audio/music/5_Phat_Phrog_Studio_Replicant_Rebellion_Binary_Abyss_LOOP.mp3",
  "gameplay/audio/music/6_Phat_Phrog_Studio_Phantom_Samurai_Steel_Ronin_LOOPED.mp3",
  "gameplay/audio/music/6_Phat_Phrog_Studio_Replicant_Rebellion_Machine_Soul_LOOP.mp3",
  "gameplay/audio/music/7_Phat_Phrog_Studio_Binary_Bushido_Bionic_Bound_LOOP.mp3",
  "gameplay/audio/music/7_Phat_Phrog_Studio_Phantom_Samurai_Katana_Clash_LOOPED.mp3",
];

// win / lose
const winMusic = ["gameplay/audio/music/Retro_Victory_1.wav"];

const loseMusic = ["gameplay/audio/music/Retro_Defeat_3.wav"];

// base
const baseDie = ["gameplay/audio/sfx/mainframe_collapse.wav"];

const baseHit = [
  "gameplay/audio/sfx/enemy_disintegrate_md.wav",
  "gameplay/audio/sfx/enemy_hit_md.wav",
];

// firewall
const firewallDie = ["gameplay/audio/sfx/mainframe_hit_a.wav"];

// enemy
const enemyHit = [
  "gameplay/audio/sfx/enemy_distintegrate_lo.wav",
  "gameplay/audio/sfx/enemy_disintegrate_md.wav",
  "gameplay/audio/sfx/enemy_hit_md.wav",
];

// player
const playerAttack = ["gameplay/audio/sfx/enemy_hit_hi.wav"];

const playerMissed = ["gameplay/audio/sfx/player_reload.wav"];

class GameAudio {
  constructor() {
    // user need to click on something to consent play audio
    // this will be the start game "Enter" button
    // Game class will trigger it, and let GameAudio know
    // ***** interaction NEED to trigger Audio.play() at least 1 time
    this.playerConsent = false;
    this.musicVolume = 0.3;
    this.sfxVolume = 1;
    this.audioCacheMap = new Map(); // audio instance
    this.audioIndexMap = new Map(); // current index of each list
    this.currentMusic = null; // only 1 music at a time

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
  stopMusic() {
    if (!this.currentMusic) return;
    this.currentMusic.pause();
    this.currentMusic.currentTime = 0;
    this.currentMusic = null;
  }

  toggleMusic() {
    if (!this.currentMusic) return;

    if (this.currentMusic.paused) {
      this.currentMusic.play().catch(console.warn);
    } else {
      this.currentMusic.pause();
    }
  }

  play_ui_set() {
    this.play("../audio/sfx/menu_set.wav");
  }

  play_ui_unset() {
    this.play("../audio/sfx/menu_unset.wav");
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

  play(path, isMusic = false, loop = false) {
    if (!this.playerConsent) return;
    // check localstorage audio muted
    const isMuted = localStorage.getItem("aud_muted");
    if (isMuted && isMuted === "true") return;

    // find audio / create audio
    let audio;
    if (this.audioCacheMap.has(path)) {
      audio = this.audioCacheMap.get(path).cloneNode(); // to allow multiple play
    } else {
      const original = new Audio(path);
      this.audioCacheMap.set(path, original);
      audio = original.cloneNode();
    }
    // Set volume and loop
    audio.volume = isMusic ? this.musicVolume : this.sfxVolume;
    audio.loop = loop;

    // Stop current music before playing new one
    if (isMusic && loop) {
      this.stopMusic();
      this.currentMusic = audio;
    }

    // remove after played
    audio.addEventListener("ended", () => {
      audio.removeAttribute("src");
      audio.load();
    });

    // play
    audio.play().catch((err) => {
      console.warn(`Audio failed to play: ${path}`, err);
    });
  }
  playFromList(list, isRandom = false, isMusic = false, loop = false) {
    if (!this.playerConsent || !list.length) return;

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
  playWinMusic(isRandom) {
    this.playFromList(winMusic, isRandom, true);
  }
  playLoseMusic(isRandom) {
    this.playFromList(loseMusic, isRandom, true);
  }
  // --------- SFX ----------
  // Base
  playBaseHit(isRandom) {
    this.playFromList(baseHit, isRandom);
  }
  playBaseDie(isRandom) {
    this.playFromList(baseDie, isRandom);
  }
  // Firewall
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
}
const gameAudio = new GameAudio();
export { gameAudio };
