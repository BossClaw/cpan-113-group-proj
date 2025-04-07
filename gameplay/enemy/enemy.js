import { gameAudio } from "../game-audio/gameAudio.js";
import { enemyDictionary } from "./enemyDictionary.js";

// gameScreen is the #game_screen div
// speed is calculated by game's difficult, game's level and enemy's own speed
export class Enemy {
  static nextId = 1;
  constructor(gameScreen, enemyKey = "lv1", gameSpeed = 1) {
    this.id = Enemy.nextId++;

    // base info
    this.gameScreen = gameScreen;
    const enemyData = enemyDictionary[enemyKey] || enemyDictionary["lv1"];

    // styles & layout
    this.outerClass = "enemy";
    this.innerClass = "enemy-sprit";
    this.outerDiv = null;
    this.innerDiv = null;
    this.width = enemyData.size;
    this.height = enemyData.size;

    // state
    this.isAlive = true;
    this.name = enemyData.name;
    this.hp = enemyData.hp;
    this.speed = enemyData.speed * gameSpeed;
    this.damage = enemyData.damage;
    this.innerColor = enemyData.color;

    // movement
    this.isMoving = false;
    this.defaultMovementDuration = 3;
    this.actualMovementDuratrion = this.defaultMovementDuration / this.speed;

    // test info
    this.enemyInfo = null;

    // bind methods
    this.spawn = this.spawn.bind(this);
    this.move = this.move.bind(this);
    this.takeDamage = this.takeDamage.bind(this);
    this.destroy = this.destroy.bind(this);
    this.attack = this.attack.bind(this);
  }
  spawn() {
    // this.x = gameScreen.offsetWidth; // deault x position
    // this.y = 70; // default y position
    const x = this.gameScreen.offsetWidth;
    const yMax = 110; // away from top
    const yMin = 40; // away from top
    const y = Math.random() * (yMax - yMin) + yMin;

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
    // TODO - COMMON STYLE FOR BACKGROUND
    this.innerDiv.classList.add("enemy_inner");
    this.innerDiv.classList.add(this.innerClass);
    let bg_str = `url("gameplay/enemy/${this.name}.gif")`;
    this.innerDiv.style.backgroundImage = bg_str;

    // css animaiton speed
    this.outerDiv.style.animationDuration =
      this.defaultMovementDuration / this.speed + "s";

    // put it on screen
    this.outerDiv.appendChild(this.innerDiv);
    this.gameScreen.appendChild(this.outerDiv);

    // (testing) show enemy info
    // this.enemyInfo = document.createElement("div");
    // this.enemyInfo.classList.add("enemy-info");
    // this.outerDiv.appendChild(this.enemyInfo);
    // this.updateInfo();

    return this.outerDiv;
  }
  updateInfo() {
    // this.enemyInfo.innerText = `HP: ${this.hp}`;
  }
  move() {
    // only call 'move' once at the start
    this.outerDiv.classList.add("move");
  }
  pause() {
    this.outerDiv.classList.add("stop");
  }
  resume() {
    this.outerDiv.classList.remove("stop");
  }
  getLocationX() {
    return this.outerDiv.getBoundingClientRect().left

  }
  takeDamage(amount) {
    this.hp -= amount;
    this.innerDiv.classList.remove("hit");
    void this.innerDiv.offsetWidth; // Trigger reflow
    this.innerDiv.classList.add("hit");

    // play SFX
    gameAudio.playEnemyHit()

    // die
    if (this.hp <= 0) {
      this.destroy();
    }
  }
  attack() {
    this.takeDamage(this.damage)
    return this.damage;
  }
  destroy() {
    // removing 'move' will make the enemy get back to original location, so we need to keep this location
    this.outerDiv.classList.add("stop");
    this.innerDiv.classList.add(
      "animate__animated",
      "animate__slideOutRight",
      "animate__faster"
    );
    this.innerDiv.style.animationDuration = "0.2s";
    this.innerDiv.classList.remove("hit");
    void this.innerDiv.offsetWidth; // Trigger reflow
    this.innerDiv.classList.add("hit");

    // is dead
    this.isAlive = false;
    setTimeout(() => {
      this.outerDiv.remove();
    }, 600);
  }
}
