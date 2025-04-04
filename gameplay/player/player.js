import { gameAudio } from "../game-audio/gameAudio.js";

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

    // location/styles
    this.outerClass = "player";
    this.innerClass = "player-sprit";
    this.width = "32px";
    this.height = "32px";

    // divs
    this.outerDiv = null;
    this.innerDiv = null;
    this.missedDiv = null;

    // states
    this.gunDamage = getGun(gun).damage;
    this.gunSound = getGun(gun).sound;

    // (testing)
    this.playerInfo = null;
  }
  spawn() {
    if (!this.gameScreen) {
      return;
    }
    const x = 35;
    const y = 70;

    // Creat outter div
    this.outerDiv = document.createElement("div");
    this.outerDiv.classList.add(this.outerClass);
    this.outerDiv.style.position = "absolute";
    this.outerDiv.style.width = `${this.width}px`;
    this.outerDiv.style.height = `${this.height}px`;
    this.outerDiv.style.left = `${x}px`;
    this.outerDiv.style.top = `${y}px`;

    // Create inner div
    this.innerDiv = document.createElement("div");
    this.innerDiv.classList.add(this.innerClass);
    this.outerDiv.appendChild(this.innerDiv);

    // create misss-div
    this.missedDiv = document.createElement("div");
    this.missedDiv.classList.add("missed-div");
    this.outerDiv.appendChild(this.missedDiv);

    // put it on screen
    this.gameScreen.appendChild(this.outerDiv);

    // (testing) show player gun damage
    // this.playerInfo = document.createElement("div");
    // this.playerInfo.classList.add("player-info");
    // this.innerDiv.appendChild(this.playerInfo);
    // this.playerInfo.innerText = this.gunDamage;

    return this.outerDiv;
  }
  getLocationX() {
    return this.outerDiv.getBoundingClientRect().left;
  }
  attack() {
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
