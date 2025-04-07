// return an array of enemy (eg: "lv1", "lv1", "lv2")
// created in Game class when constructed
import { enemyDictionary } from "./enemyDictionary";


export function enemeySpawnList(spawnCount, currentLevel) {
  const spawnDistribution = {}

  for (const [key, enemy] of Object.entries(enemyDictionary)) {
    const enemyLevel = enemy.level;

    // Skip level 0 (spawn on player mis-typed)
    if (enemyLevel == 0) continue;
    // Skip level 1 (fill in later)
    if (enemyLevel == 1) continue;

    // All level 2 and above enemy
    spawnDistribution[enemyLevel] = Math.floor(currentLevel / enemyLevel);
  }

  // calcuate higher level enemies count
  let totalHigherEnemies = 0
  for (const [key, value] of Object.entries(spawnDistribution)) {
    totalHigherEnemies += value
  }

  // Reduce higher level enemies if over spawn count
  while (totalHigherEnemies > spawnCount) {
    // go through each enemy to reduce count, from lv2 -> up
    for (const [key, value] of Object.entries(spawnDistribution)) {
      if (spawnDistribution[key] > 0) {
        spawnDistribution[key]--
        totalHigherEnemies--
        if (totalHigherEnemies <= spawnCount) break
      }
    }
  }

  // Fill the rest with level 1 enemies 
  spawnDistribution[1] = spawnCount - totalHigherEnemies

  // Create enemies spawn array
  const enemiesArray = []
  for (const [key, value] of Object.entries(spawnDistribution)) {
    for (let i = 0; i < value; i++) {
      const level = Number(key)
      enemiesArray.push(level)
    }
  }
  // sort array just in case
  enemiesArray.sort((a, b) => a - b)

  // return array 
  // eg: [1, 1, 1, 1, 2, 2, 3, ...]
  return enemiesArray
}