// return an array of enemy (eg: "lv1", "lv1", "lv2")
// created in Game class when constructed
import { enemyDictionary } from "./enemyDictionary.js";

export function enemySpawnList(spawnCount, level = 1, difficult = "normal") {
  const spawnDistribution = {};
  let addOnLevels = 1;

  // Higher level enemy (level > 1)
  // Higher level enemy appears only when game level is at least (enemy level × this value)
  const ENEMY_LEVEL_GATE = 2

  // Higher level enemy spawn divided by
  const ENEMY_SPAWN_DIVIDE = 3

  // check difficulty
  switch (difficult) {
    case "easy":
      addOnLevels = 0;
      break;
    case "normal":
      addOnLevels = 1;
      break;
    case "hard":
      addOnLevels = 2;
      break;
    case "hardcore":
      addOnLevels = 3;
      break;
    default:
      console.log(
        `[GAMEPLAY][ENEMIES] UNKNOWN DIFFICULTY PASSED TO SPAWN [${difficult}]`
      );
      addOnLevels = 1;
  }

  for (const [key, enemy] of Object.entries(enemyDictionary)) {
    const enemyLevel = enemy.level;
    const currentLevel = level + addOnLevels;

    // Skip level 0 (spawn or player mis-typed)
    if (enemyLevel == 0) continue

    // Skip level 1 (fill in later)
    if (enemyLevel == 1) continue

    // Skip enemy that is too high level
    if (currentLevel < enemyLevel * ENEMY_LEVEL_GATE) continue

    // Higher level enemy count
    const spawnCount = Math.floor(
      (currentLevel * Math.log2(currentLevel)) / enemyLevel
    )
    // Reduce enemy count
    const dividedSpawnCount = Math.floor(spawnCount / ENEMY_SPAWN_DIVIDE)

    // Set enemy count
    spawnDistribution[enemyLevel] = dividedSpawnCount
  }

  // calcuate higher level enemies count
  let totalHigherEnemies = 0;
  for (const [key, value] of Object.entries(spawnDistribution)) {
    totalHigherEnemies += value;
  }

  // Reduce higher level enemies if over spawn count
  while (totalHigherEnemies > spawnCount) {
    // go through each enemy to reduce count, from lv2 -> up
    for (const [key, value] of Object.entries(spawnDistribution)) {
      if (spawnDistribution[key] > 0) {
        spawnDistribution[key]--;
        totalHigherEnemies--;
        if (totalHigherEnemies <= spawnCount) break;
      }
    }
  }

  // Fill the rest with level 1 enemies
  spawnDistribution[1] = spawnCount - totalHigherEnemies;

  // Create enemies spawn array
  const enemiesArray = [];
  for (const [key, value] of Object.entries(spawnDistribution)) {
    for (let i = 0; i < value; i++) {
      const level = Number(key);
      enemiesArray.push(level);
    }
  }
  // shuffle enemy list
  function shuffle(array) {
    // shuffle from end -> start
    for (let i = array.length - 1; i > 0; i--) {
      // shuffle
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[randomIndex];
      array[randomIndex] = temp;
    }
  }
  shuffle(enemiesArray);

  // return array
  // eg: [1, 1, 1, 1, 2, 2, 3, ...]
  console.log("enemiesArray:", enemiesArray);
  return enemiesArray;
}
