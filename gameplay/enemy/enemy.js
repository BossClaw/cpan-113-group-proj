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
  static nextId = 1

  constructor(gameScreen, enemyLevel = 1, gameSpeed = 1) {
    // id
    this.id = Enemy.nextId++

    // location/styles
    this.gameScreen = gameScreen;
    this.outerClass = 'enemy'
    this.innerClass = 'enemy-sprit'
    this.outerDiv = null
    this.innerDiv = null
    this.width = getEnemyData(enemyLevel).size;
    this.height = getEnemyData(enemyLevel).size;

    // states
    this.isAlive = true
    this.name = getEnemyData(enemyLevel).name
    this.hp = getEnemyData(enemyLevel).hp
    this.speed = getEnemyData(enemyLevel).speed * gameSpeed
    this.damage = getEnemyData(enemyLevel).damage;
    this.innerColor = getEnemyData(enemyLevel).color

    // movement
    this.isMoving = false;
    this.defaultMovementDuration = 3
    this.actualMovementDuratrion = this.defaultMovementDuration / this.speed

    // testing info
    this.enemyInfo = null

    // bind methods just in case
    this.spawn = this.spawn.bind(this)
    this.move = this.move.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.destroy = this.destroy.bind(this)
    this.attack = this.attack.bind(this)
  }
  spawn(gameScreen) {
    if (!gameScreen) {
      console.error('Enemy spawn missing gameScreen param')
      return
    }
    // this.x = gameScreen.offsetWidth; // deault x position
    // this.y = 70; // default y position
    const x = gameScreen.offsetWidth
    const yMax = 110 // away from top
    const yMin = 40 // away from top
    const y = Math.random() * (yMax - yMin) + yMin

    // Creat outter div
    this.outerDiv = document.createElement('div');
    this.outerDiv.classList.add(this.outerClass)
    this.outerDiv.style.position = 'absolute';
    this.outerDiv.style.width = `${this.width}px`;
    this.outerDiv.style.height = `${this.height}px`;
    this.outerDiv.style.left = `${x}px`;
    this.outerDiv.style.top = `${y}px`;


    // Create inner div
    this.innerDiv = document.createElement('div');
    this.innerDiv.classList.add(this.innerClass);
    this.innerDiv.style.backgroundColor = this.innerColor;

    // css animaiton speed
    this.outerDiv.style.animationDuration = (this.defaultMovementDuration / this.speed) + 's'

    // put it on screen
    this.outerDiv.appendChild(this.innerDiv);
    gameScreen.appendChild(this.outerDiv);

    // (testing) show enemy info
    this.enemyInfo = document.createElement('div')
    this.enemyInfo.classList.add('enemy-info')
    this.outerDiv.appendChild(this.enemyInfo)
    this.updateInfo()

    return this.outerDiv
  }
  updateInfo() {
    this.enemyInfo.innerText = `HP: ${this.hp}`
  }
  move() {
    this.outerDiv.classList.add('move')
  }
  getLocationX() {
    return this.outerDiv.getBoundingClientRect().left - this.gameScreen.getBoundingClientRect().left
  }
  takeDamage(amount) {
    console.log(`Enemy took damage: ${amount}`)
    this.hp -= amount;
    this.innerDiv.classList.remove('hit')
    this.innerDiv.classList.add('hit')
    // die
    if (this.hp <= 0) {
      this.destroy()
    }
  }
  attack() {
    console.log(`Enemy attack casuse ${this.damage} damage`)
    this.destroy()
    return this.damage
  }
  destroy() {
    // removing 'move' will make the enemy get back to original location, so we need to keep this location
    this.outerDiv.classList.add('stop')
    this.innerDiv.classList.add(
      'animate__animated',
      'animate__slideOutRight',
      'animate__faster'
    );
    this.innerDiv.style.animationDuration = '0.2s';
    void this.innerDiv.offsetWidth; // Trigger reflow

    this.innerDiv.classList.remove('hit')
    this.innerDiv.classList.add('hit')

    // is dead
    this.isAlive = false
    setTimeout(() => {
      console.log(`Enemy destroyed`)
      this.outerDiv.remove()
    }, 600)
  }
}

