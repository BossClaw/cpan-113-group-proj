// return an array of enemy (eg: "lv1", "lv1", "lv2")
// created in Game class when constructed
import { enemyDictionary } from "./enemyDictionary.js";


export function enemeySpawnList(spawnCount, level = 1, difficult = 'normal') {
  const spawnDistribution = {}
  let addOnLevels = 1 // more enemies sooner

  // check difficulty
  switch (difficult) {
    case 'easy':
    case 'normal':
      addOnLevels = 1;
      break;
    case 'hard':
      addOnLevels = 2;
      break;
    case 'hardcore':
      addOnLevels = 3;
      break;
    default:
      addOnLevels = 1;
  }

  console.log('addOnLevels:', addOnLevels)

  for (const [key, enemy] of Object.entries(enemyDictionary)) {
    const enemyLevel = enemy.level;
    const currentLevel = level + addOnLevels

    // Skip level 0 (spawn on player mis-typed)
    if (enemyLevel == 0) continue;
    // Skip level 1 (fill in later)
    if (enemyLevel == 1) continue;

    // All level 2 and above enemy
    spawnDistribution[enemyLevel] = Math.floor(currentLevel * Math.log2(currentLevel) / enemyLevel);
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
  console.log('enemiesArray:', enemiesArray)
  return enemiesArray
}


enemeySpawnList(80, 1)