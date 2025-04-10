import { gameAudio } from "../game-audio/gameAudio.js";

export class Mainframe {
  constructor(gameScreen) {
    this.gameScreen = gameScreen
    // location/styles
    this.outerClass = "mainframe";
    this.innerClass = "mainframe-sprit";
    this.locationX = 8
    this.locationY = 45

    // divs
    this.outerDiv = null;
    this.innerDiv = null;

    // stats
    this.hp = 10
    this.isAlive = true
  }
  spawn() {
    if (!this.gameScreen) {
      console.warn('missing game screen')
      return;
    }
    // Create outer div
    this.outerDiv = document.createElement("div");
    this.outerDiv.classList.add(this.outerClass);
    this.outerDiv.style.position = "absolute";
    this.outerDiv.style.left = `${this.locationX}px`;
    this.outerDiv.style.top = `${this.locationY}px`;

    // Create inner div
    this.innerDiv = document.createElement("div");
    this.innerDiv.classList.add(this.innerClass);
    this.outerDiv.appendChild(this.innerDiv);

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
    // SFX
    gameAudio.playBaseHit()

    // change sprit image / color based on damage taken
    // .... logic here ...
    this.innerDiv.classList.remove("hit");
    void this.innerDiv.offsetWidth; // Trigger reflow
    this.innerDiv.classList.add("hit");

    if (this.hp <= 0) {
      this.destroy()
    }
  }
  changeDamageStage(stage = 0) {
    // 0 = default, increase stage as damaged
    const maxStage = 3
    const damageStage = Math.min(maxStage, Math.max(0, stage))
    let color = "#FFFFFF";

    switch (damageStage) {
      case 0:
        color = "#FFFFFF";
        break;
      case 1:
        color = "#FFCCCC";
        break;
      case 2:
        color = "#FF6666";
        break;
      case 3:
        color = "#FF3333";
        break;
    }
    this.innerDiv.style.backgroundColor = color;
  }
  destroy() {
    this.isAlive = false
    // change sprit image / color to destroyed
    // .... logic here ...
    this.innerDiv.classList.remove("hit");
    this.innerDiv.classList.add("destroyed");
    void this.innerDiv.offsetWidth;
  }
}