// to get localStorage scores and update the leaderboard
const dummyScores = [
	{
		// not recorded
		name: 'BOS',
		score: 112300, // number
		maxLevel: '10', // string
		language: ['Python', 'JavaScript', 'CSS'],
		difficulty: 'easy',
		date: new Date(2025, 4, 8),
	},
	{
		name: 'JAS',
		score: 57900,
		maxLevel: '6',
		language: ['Python', 'JavaScript', 'CSS'],
		difficulty: 'normal',
		date: new Date(2025, 4, 8),
	},
	{
		name: 'LOL',
		score: 74200,
		maxLevel: '7',
		language: ['JavaScript'],
		difficulty: 'normal',
		date: new Date(2025, 4, 7),
	},
	{
		name: 'CHO',
		score: 133900,
		maxLevel: '12',
		language: ['Python', 'JavaScript'],
		difficulty: 'easy',
		date: new Date(2025, 4, 8),
	},
];

function updateLocalLeaderboard(limit = 10) {
	// get local scores
	const localScoresString = localStorage.getItem('settings_scores');
	const localScores = JSON.parse(localScoresString) || [];

	// combine dummy score with local scores
	const scores = [...localScores, ...dummyScores];

	// sort highest score on top
	scores.sort((a, b) => b.score - a.score);

	// only show records within limit
	scores.splice(limit + 1);

	// display on leader board
	const leaderboardTableBody = document.querySelector('#leaderboardTableBody');
	leaderboardTableBody.innerHTML = '';

	// LOOP THROUGH SCORES
	for (let i = 0; i < scores.length; i++) {
		// score text
		const scoreRecord = scores[i];
		//const scoreText = String(scoreRecord.score).padStart(8, '0');
		const scoreText = String(scoreRecord.score);

		// placement text
		let placement;
		if (i === 0) {
			placement = `1ST`;
		} else if (i === 1) {
			placement = `2ND`;
		} else if (i === 2) {
			placement = `3RD`;
		} else {
			placement = `${i + 1}TH`;
		}

		// create elements
		// place
		const placeTd = document.createElement('td');
		placeTd.innerText = placement;

		// level
		const levelTd = document.createElement('td');
		//levelTd.innerText = `lv.${scoreRecord.maxLevel}`;
		levelTd.innerText = String(scoreRecord.maxLevel).padStart(3,'0');

		// difficulty
		const diffTd = document.createElement('td');
		diffTd.innerText = scoreRecord.difficulty;

		// score
		const scoreTd = document.createElement('td');
		scoreTd.classList.add('prSco');
		scoreTd.innerText = scoreText;

		// name
		const nameTd = document.createElement('td');
		nameTd.innerText = scoreRecord.name;

		// create SCORE TABLE ROW
		const scoreTr = document.createElement('tr');
    scoreTr.classList.add(`lb${i + 1}`);
		scoreTr.appendChild(placeTd);
		scoreTr.appendChild(levelTd);
		scoreTr.appendChild(diffTd);
		scoreTr.appendChild(scoreTd);
		scoreTr.appendChild(nameTd);

		// A BODY INNERHTML TO TABLE ROWS
		leaderboardTableBody.appendChild(scoreTr);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	updateLocalLeaderboard();
});
