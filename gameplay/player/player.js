const hatList = [

]

const theGunDictionary = {
  'debugger': {
    damage: 1,
    description: "Fires rapid-fire semicolons that eliminate syntax errors with deadly precision.",
    sound: 'ZAP'
  },
  'hotfixer': {
    damage: 2,
    description: "Shoots beams of null-check logic that vaporize unexpected null references.",
    sound: 'PSSSH',
  },
  'rubberducker': {
    damage: 3,
    description: 'Forged in the fires of frustration, this legendary sidearm listens in silence, strikes with clarity, anddestroy your foe with wisdom.',
    sound: 'QUAAK',
  }
}

function getGun(gun = 'debugger') {
  if (!theGunDictionary[gun]) {
    return theGunDictionary.debugger
  } else {
    return theGunDictionary[gun]
  }
}

export class Player {
  constructor(gun = null, hat = null) {
    // location/styles
    this.outerClass = 'player'
    this.innerClass = 'player-sprit'
    this.outerDiv = null
    this.innerDiv = null
    this.width = '32px'
    this.height = '32px';

    // states
    this.gunDamage = getGun(gun).damage
    this.gunSound = getGun(gun).sound

    // (testing)
    this.playerInfo = null
  }
  spawn(gameScreen) {
    if (!gameScreen) {
      console.error('Player spawn missing gameScreen param')
      return
    }
    const x = 20;
    const y = 70;

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

    // put it on screen
    this.outerDiv.appendChild(this.innerDiv);
    gameScreen.appendChild(this.outerDiv);

    // (testing) show player gun damage
    this.playerInfo = document.createElement('div')
    this.playerInfo.classList.add('player-info')
    this.innerDiv.appendChild(this.playerInfo)
    this.playerInfo.innerText = this.gunDamage

    return this.outerDiv
  }
  attack() {
    console.log(`Player attack cause ${this.gunDamage}`)
    return this.gunDamage
  }
}