const enemyList = [
  {
    name: 'error',
    hp: 1,
    damage: 1,
    speed: 1.5,
    color: 'red'
  },
  {
    name: 'bug',
    hp: 1,
    damage: 1,
    speed: 1,
    color: 'blue'
  },
  {
    name: 'overflow',
    hp: 5,
    damage: 2,
    speed: 1,
    color: 'green'
  },
  {
    name: 'infinite-loop',
    hp: 20,
    damage: 2,
    speed: 1,
    color: 'black'
  }
]

function getEnemyFromList(level) {
  if (level < 0) level = 0
  if (level >= enemyList.length) level = enemyList.length - 1
  return enemyList[level]
}

// gameScreen is the #game_screen div 
export class Enemy {
  constructor(gameScreen, level = 1) {
    // location/styles
    this.gameScreen = gameScreen;
    this.outerClass = 'enemy'
    this.innerClass = 'enemy-sprit'
    this.outerDiv = null
    this.innerDiv = null
    this.width = 40;
    this.height = 40;
    this.x = gameScreen.offsetWidth; // deault x position
    this.y = 70; // default y position
    this.isMoving = false;

    // states
    this.name = getEnemyFromList(level).name
    this.hp = getEnemyFromList(level).hp
    this.speed = getEnemyFromList(level).speed;
    this.damage = getEnemyFromList(level).damage;
    this.innerColor = getEnemyFromList(level).color


    // bind methods just in case
    this.spawn = this.spawn.bind(this)
    this.move = this.move.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.destroy = this.destroy.bind(this)
    this.attack = this.attack.bind(this)
  }
  spawn() {
    // Creat outter div
    this.outer = document.createElement('div');
    this.outer.classList.add(this.outerClass)
    this.outer.style.position = 'absolute';
    this.outer.style.width = `${this.width}px`;
    this.outer.style.height = `${this.height}px`;
    this.outer.style.left = `${this.x}px`;
    this.outer.style.top = `${this.y}px`;
    this.outerDiv = this.outer

    // Create inner div
    this.inner = document.createElement('div');
    this.inner.classList.add(this.innerClass);
    this.inner.style.width = '100%';
    this.inner.style.height = '100%';
    // Temp color so we can see it
    this.inner.style.backgroundColor = this.innerColor;
    this.innerDiv = this.inner

    // put it on screen
    this.outer.appendChild(this.inner);
    this.gameScreen.appendChild(this.outer);
  }
  move() {
    this.outerDiv.classList.add('move')
  }
  takeDamage(amount) {
    console.log(`Enemy took damage: ${amount}`)
    this.hp -= amount;
    // die
    if (this.hp <= 0) {
      this.destroy()
    }
  }
  destroy() {
    console.log(`Enemy destroyed`)
    this.gameScreen.removeChild(this.outer);
  }
  attack() {
    console.log(`Enemy attack casuse ${this.damage} damage`)
    return this.damage
  }
}




