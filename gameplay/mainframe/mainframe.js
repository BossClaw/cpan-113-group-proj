import { gameAudio } from "../game-audio/gameAudio.js";

export class Mainframe {
  constructor(gameScreen, hp = 10) {
    this.gameScreen = gameScreen
    // location/styles
    this.outerClass = "mainframe";
    this.innerClass = "mainframe-sprit";
    this.locationX = 8,
      this.locationY = 45

    // divs
    this.outerDiv = null;
    this.innerDiv = null;


    // stats
    this.hp = hp
    this.isAlive = true
  }
  spawn() {
    if (!this.gameScreen) {
      console.warn('missing game screen')
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

    // create misss-div
    this.missedDiv = document.createElement("div");
    this.missedDiv.classList.add("missed-div");
    this.outerDiv.appendChild(this.missedDiv);

    // put it on screen
    this.gameScreen.appendChild(this.outerDiv);

    // (testing) show hp
    this.hpDisplay = document.createElement("div");
    this.hpDisplay.classList.add("mainframe-hp");
    this.innerDiv.appendChild(this.hpDisplay);
    this.hpDisplay.innerText = this.hp;

    return this.outerDiv;
  }
  // (testing)
  updateHpDisplay() {
    this.hpDisplay.innerText = this.hp
  }
  getLocationX() {
    return this.outerDiv.getBoundingClientRect().right;
  }
  takeDamage(damage = 1) {
    this.hp -= damage
    // SFX
    gameAudio.playBaseHit()

    // change sprit image / color based on damage taken
    // .... logic here ...

    if (this.hp < 0) {
      this.isAlive = false
      // change sprit image / color to destroyed
      // .... logic here ...
    }
  }
}