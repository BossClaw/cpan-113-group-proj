// to get localStorage scores and update the leaderboard 
const dummyScores = [
  {
    // not recorded
    name: 'BOS',
    score: 112300, // number
    maxLevel: '10', // string
    language: ["Python", "JavaScript", "CSS"],
    difficulty: 'easy',
    date: new Date(2025, 4, 8)
  },
  {
    name: 'JAS',
    score: 57900,
    maxLevel: '6',
    language: ["Python", "JavaScript", "CSS"],
    difficulty: 'normal',
    date: new Date(2025, 4, 8)
  },
  {
    name: 'LOL',
    score: 74200,
    maxLevel: '7',
    language: ["JavaScript"],
    difficulty: 'normal',
    date: new Date(2025, 4, 7)
  },
  {
    name: 'CHO',
    score: 133900,
    maxLevel: '12',
    language: ["Python", "JavaScript"],
    difficulty: 'easy',
    date: new Date(2025, 4, 8)
  }
]

function updateLocalLeaderboard(limit = 10) {
  let scores
  const scoresString = localStorage.getItem('settings_scores')

  if (scoresString) {
    scores = JSON.parse(scoresString)
  } else {
    scores = dummyScores
  }

  // sort highest score on top
  scores.sort((a, b) => b.score - a.score)

  // only show records within limit
  scores.splice(limit + 1)

  // display on leader board
  const leaderboardDiv = document.querySelector('#leaderboard')
  // clean
  leaderboardDiv.innerHTML = ''

  for (let i = 0; i < scores.length; i++) {
    // score text
    const scoreRecord = scores[i]
    const scoreText = String(scoreRecord.score).padStart(8, '0')
    // placement text
    let placement
    if (i === 0) {
      placement = `1ST`
    } else if (i === 1) {
      placement = `2ND`
    } else if (i === 2) {
      placement = `3RD`
    } else {
      placement = `${i + 1}TH`
    }

    // create elements
    const placeSpan = document.createElement('span')
    placeSpan.innerText = placement
    const scoreSpan = document.createElement('span')
    scoreSpan.innerText = scoreText
    const nameSpan = document.createElement('span')
    nameSpan.innerText = scoreRecord.name

    // create h2
    const scoreH2 = document.createElement('h2')
    scoreH2.appendChild(placeSpan)
    scoreH2.appendChild(scoreSpan)
    scoreH2.appendChild(nameSpan)

    // append
    leaderboardDiv.appendChild(scoreH2)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateLocalLeaderboard()
})