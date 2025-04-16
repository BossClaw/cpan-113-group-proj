import { gameAudio } from "../audio/gameAudio.js";

const hatList = [];

const theGunDictionary = {
  debugger: {
    damage: 1,
    description:
      "Fires rapid-fire semicolons that eliminate syntax errors with deadly precision.",
    sound: "ZAP",
  },
  hotfixer: {
    damage: 2,
    description:
      "Shoots beams of null-check logic that vaporize unexpected null references.",
    sound: "PSSSH",
  },
  rubberducker: {
    damage: 3,
    description:
      "Forged in the fires of frustration, this legendary sidearm listens in silence, strikes with clarity, anddestroy your foe with wisdom.",
    sound: "QUAAK",
  },
};

function getGun(gun = "debugger") {
  if (!theGunDictionary[gun]) {
    return theGunDictionary.debugger;
  } else {
    return theGunDictionary[gun];
  }
}
export class Player {
  constructor(gameScreen, gun = null, hat = null) {
    this.gameScreen = gameScreen;

    // player states
    this.states = {
      PORTING: 'porting',
      READY: 'ready',
      EXITING: 'exiting',
      OUT: 'out'
    }
    this.currentState = null;

    // location/styles
    this.outerClass = "player";
    this.innerClass = "player-sprite";
    this.locationX = 44;
    this.locationY = 70;

    // divs
    this.outerDiv = null;
    this.innerDiv = null;
    this.missedDiv = null;

    // gun
    this.gunDamage = getGun(gun).damage;
    this.gunSound = getGun(gun).sound;

    // sprites
    this.sprites = {
      porting: {
        image: 'gameplay/player/player_intro.gif',
        duration: 2100, // ms
      },
      idle: {
        image: 'gameplay/player/player_idle.gif',
        duration: 660,
      },
      fire: {
        image: 'gameplay/player/player_fire.gif',
        duration: 530,
      },
      exit: {
        image: 'gameplay/player/player_outro.gif',
        duration: 2100,
      }
    }

    // shooting
    this.attackTimeout = null

    // (testing)
    this.playerInfo = null;
  }
  spawn() {
    if (!this.gameScreen) {
      return;
    }

    // Creat outter div
    this.outerDiv = document.createElement("div");
    this.outerDiv.classList.add(this.outerClass);
    this.outerDiv.style.position = "absolute";
    this.outerDiv.style.left = `${this.locationX}px`;
    this.outerDiv.style.top = `${this.locationY}px`;

    // Create inner div
    this.innerDiv = document.createElement("div");
    this.innerDiv.classList.add(this.innerClass);
    this.outerDiv.appendChild(this.innerDiv);

    // create inner div's image 
    this.spriteImage = document.createElement('img')
    this.innerDiv.appendChild(this.spriteImage)

    // create misss-div
    this.missedDiv = document.createElement("div");
    this.missedDiv.classList.add("missed-div");
    this.outerDiv.appendChild(this.missedDiv);

    // put it on screen
    this.gameScreen.appendChild(this.outerDiv);

    // change game state
    this.currentState = this.states.PORTING

    // play porting-in animation
    this.spriteImage.src = this.sprites.porting.image

    // change state when porting-in animation finished
    setTimeout(() => {
      this.currentState = this.states.READY
      this.spriteImage.src = this.sprites.idle.image

    }, this.sprites.porting.duration)

    return this.outerDiv;
  }
  exit(isWin = true) {
    // change game state
    this.currentState = this.states.EXITING

    // clean attack timeout
    if (this.attackTimeout) {
      clearTimeout(this.attackTimeout)
      this.attackTimeout = null;
    }

    if (isWin) {
      this.spriteImage.src = this.sprites.exit.image
    } else {
      this.spriteImage.src = this.sprites.exit.image
    }

    // change state when porting-in animation finished
    setTimeout(() => {
      this.currentState = this.states.OUT

      // (TODO) 
      // remove the player image for now
      this.spriteImage.remove()
    }, this.sprites.exit.duration)
  }
  getLocationX() {
    return this.outerDiv.getBoundingClientRect().left;
  }
  attack() {
    // change close
    this.innerDiv.classList.remove('shoot')
    void this.innerDiv.offsetWidth; // Trigger reflow
    this.innerDiv.classList.add('shoot')
    this.spriteImage.src = this.sprites.fire.image

    // clean attack timeout
    if (this.attackTimeout) {
      clearTimeout(this.attackTimeout)
      this.attackTimeout = null
    }

    // timeout
    this.attackTimeout = setTimeout(() => {
      this.innerDiv.classList.remove('shoot')
      this.spriteImage.src = this.sprites.idle.image
      this.attackTimeout = null
    }, 200)

    // play SFX
    gameAudio.playPlayerAttack()
    return this.gunDamage;
  }
  missed() {
    // play SFX
    gameAudio.playPlayerMissed()

    const message = document.createElement("div");
    message.classList.add("missed");
    message.innerText = "missed";
    this.missedDiv.appendChild(message);
    setTimeout(() => {
      message.remove();
    }, 1000);
  }
}
