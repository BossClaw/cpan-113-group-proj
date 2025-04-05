export class Mainframe {
  constructor(gameScreen, hp = 10) {
    this.gameScreen = gameScreen
    // location/styles
    this.outerClass = "mainframe";
    this.innerClass = "mainframe-sprit";

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
    const x = 8;
    const y = 45;

    // Creat outter div
    this.outerDiv = document.createElement("div");
    this.outerDiv.classList.add(this.outerClass);
    this.outerDiv.style.position = "absolute";
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
  takeDamage(damage = 1) {
    this.hp -= damage

    // change sprit image / color based on damage taken
    // .... logic here ...

    if (this.hp < 0) {
      this.isAlive = false
    }
  }
}