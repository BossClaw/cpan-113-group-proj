import { gameAudio } from "../game-audio/gameAudio.js";

export class Firewall {
  constructor(gameScreen) {
    this.gameScreen = gameScreen
    // location/styles
    this.outerClass = "firewall";
    this.innerClass = "firewall-sprit";
    this.locationX = 100

    // divs
    this.outerDiv = null;
    this.innerDiv = null;

    // stats
    this.hp = 3
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
    this.outerDiv.style.height = this.gameScreen.offsetHeight + "px";

    // Create inner div
    this.innerDiv = document.createElement("div");
    this.innerDiv.classList.add(this.innerClass);
    this.outerDiv.appendChild(this.innerDiv);

    // put it on screen
    this.gameScreen.appendChild(this.outerDiv);

    // (testing) show hp
    // this.hpDisplay = document.createElement("div");
    // this.hpDisplay.classList.add("mainframe-hp");
    // this.innerDiv.appendChild(this.hpDisplay);
    // this.hpDisplay.innerText = this.hp;

    return this.outerDiv;
  }
  // (testing)
  updateHpDisplay() {
    //this.hpDisplay.innerText = this.hp
  }
  getLocationX() {
    return this.outerDiv.getBoundingClientRect().right;
  }
  takeDamage(damage = 1) {
    this.hp -= damage
    // dmage stage
    if (this.hp == 3) {
      this.changeDamageStage(0);
    } else if (this.hp == 2) {
      this.changeDamageStage(1);
    } else {
      this.changeDamageStage(2);
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
    const maxStage = 2
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
    }
    this.innerDiv.style.backgroundColor = color;
  }
  destroy() {
    // SFX
    gameAudio.playFirewallDie()

    this.isAlive = false
    setTimeout(() => {
      this.outerDiv.remove();
    }, 600);
  }
}