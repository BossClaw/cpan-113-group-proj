// gameScreen is the #game_screen div
export class Enemy {
  constructor(gameScreen, hp = 1, speed = 1, damage = 1) {
    this.outerClass = 'enemy'
    this.innerClass = 'enemy-sprit'
    this.innerColor = 'red' // for testing
    this.hp = hp;
    this.speed = speed;
    this.damage = damage;
    this.gameScreen = gameScreen;
    this.width = 40;
    this.height = 40;
    this.x = gameScreen.offsetWidth;
    this.y = 100; // default vertical position

    // Outer div (for position)
    this.outer = document.createElement('div');
    this.outer.classList.add(this.outerClass)
    this.outer.style.position = 'absolute';
    this.outer.style.width = `${this.width}px`;
    this.outer.style.height = `${this.height}px`;
    this.outer.style.left = `${this.x}px`;
    this.outer.style.top = `${this.y}px`;

    // Inner div (for sprite/image)
    this.inner = document.createElement('div');
    this.inner.classList.add(this.innerClass);
    this.inner.style.width = '100%';
    this.inner.style.height = '100%';
    // Temp color so we can see it
    this.inner.style.backgroundColor = this.innerColor;

    // put it togeher
    this.outer.appendChild(this.inner);
    this.gameScreen.appendChild(this.outer);

    // bind methods just in case
    this.move = this.move.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.destroy = this.destroy.bind(this)
    this.attack = this.attack.bind(this)
  }
  move() {
    // move toward left
    this.x -= this.speed;
    this.outer.style.left = `${this.x}px`;
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