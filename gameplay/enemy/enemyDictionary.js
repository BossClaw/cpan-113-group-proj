// enemy sprite image should be: "gameplay/enemy/${this.name}.gif"

export const enemyDictionary = {
  lv0: {
    name: "error",
    level: 0,
    hp: 1,
    damage: 1,
    speed: 0.7,
    color: "red",
    size: "16",
  },
  lv1: {
    name: "bug",
    level: 1,
    hp: 1,
    damage: 1,
    speed: 1,
    color: "blue",
    size: "16"
  },
  lv2: {
    name: "underrun",
    level: 2,
    hp: 2,
    damage: 2,
    speed: 1,
    color: "green",
    size: "16",
  },
  lv3: {
    name: "stack-overflow",
    level: 3,
    hp: 5,
    damage: 3,
    speed: 0.5,
    color: "black",
    size: "20",
  },
  lv4: {
    name: "infinite-loop",
    level: 4,
    hp: 10,
    damage: 4,
    speed: 0.3,
    color: "black",
    size: "25",
  }
}