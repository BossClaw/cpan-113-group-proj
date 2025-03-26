const enemyList = [
  {
    name: 'error',
    hp: 1,
    damage: 1,
    speed: 1.5,
    color: 'red',
    size: '16',
  },
  {
    name: 'bug',
    hp: 1,
    damage: 1,
    speed: 1,
    color: 'blue',
    size: '16',

  },
  {
    name: 'overflow',
    hp: 5,
    damage: 2,
    speed: 1,
    color: 'green',
    size: '16',
  },
  {
    name: 'infinite-loop',
    hp: 20,
    damage: 2,
    speed: 1,
    color: 'black',
    size: '16',
  }
]

function getEnemyData(level) {
  if (level < 0) level = 0
  if (level >= enemyList.length) level = enemyList.length - 1
  return enemyList[level]
}

// gameScreen is the #game_screen div 
// speed is calculated by game's difficult, game's level and enemy's own speed
export class Enemy {
  constructor(gameScreen, enemyLevel = 1, gameSpeed = 1) {
    // location/styles
    this.gameScreen = gameScreen;
    this.outerClass = 'enemy'
    this.innerClass = 'enemy-sprit'
    this.outerDiv = null
    this.innerDiv = null
    this.width = getEnemyData(enemyLevel).size;
    this.height = getEnemyData(enemyLevel).size;
    this.x = gameScreen.offsetWidth; // deault x position
    this.y = 70; // default y position

    // states
    this.name = getEnemyData(enemyLevel).name
    this.hp = getEnemyData(enemyLevel).hp
    this.speed = getEnemyData(enemyLevel).speed * gameSpeed
    this.damage = getEnemyData(enemyLevel).damage;
    this.innerColor = getEnemyData(enemyLevel).color

    // movement
    this.isMoving = false;
    this.defaultMovementDuration = 5
    this.actualMovementDuratrion = this.defaultMovementDuration / this.speed


    // bind methods just in case
    this.spawn = this.spawn.bind(this)
    this.move = this.move.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.destroy = this.destroy.bind(this)
    this.attack = this.attack.bind(this)
  }
  spawn() {
    // Creat outter div
    this.outerDiv = document.createElement('div');
    this.outerDiv.classList.add(this.outerClass)
    this.outerDiv.style.position = 'absolute';
    this.outerDiv.style.width = `${this.width}px`;
    this.outerDiv.style.height = `${this.height}px`;
    this.outerDiv.style.left = `${this.x}px`;
    this.outerDiv.style.top = `${this.y}px`;

    // Create inner div
    this.innerDiv = document.createElement('div');
    this.innerDiv.classList.add(this.innerClass);
    this.innerDiv.style.width = '100%';
    this.innerDiv.style.height = '100%';
    this.innerDiv.style.backgroundColor = this.innerColor;

    // css animaiton speed
    this.outerDiv.style.animationDuration = (this.defaultMovementDuration / this.speed) + 's'

    // put it on screen
    this.outerDiv.appendChild(this.innerDiv);
    this.gameScreen.appendChild(this.outerDiv);
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




