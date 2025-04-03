const CURRENT_SCORE_KEY = "settings_current_score";
const SCORES_KEY = "settings_scores";
const DIFFICULTY_KEY = 'difficulty';
const LEVEL_KEY = 'level';
const LANGUAGES_KEY = 'pickedLanguages';

const defaultScore = () => ({
  name: '',
  score: 0, // number
  maxLevel: '', // string
  language: [], // string array
  difficulty: '',
  date: new Date()
});

class ScoreManager {
  getCurrentScore() {
    let scoreStr = localStorage.getItem(CURRENT_SCORE_KEY);
    let score = scoreStr ? JSON.parse(scoreStr) : defaultScore();

    score.maxLevel = localStorage.getItem(LEVEL_KEY) || '';
    score.language = JSON.parse(localStorage.getItem(LANGUAGES_KEY) || '[]');
    score.difficulty = localStorage.getItem(DIFFICULTY_KEY) || '';

    return score;
  }
  removeCurrentCore() {
    localStorage.removeItem(CURRENT_SCORE_KEY)
  }
  getScores() {
    const scoresString = localStorage.getItem(SCORES_KEY);
    return scoresString ? JSON.parse(scoresString) : [];
  }

  addToCurrentScore(_score = 0) {
    let currentScore = this.getCurrentScore();

    if (currentScore) {
      currentScore.score += _score;
      currentScore.date = new Date();
    } else {
      currentScore = defaultScore();
      currentScore.score = _score;
    }

    currentScore.maxLevel = localStorage.getItem(LEVEL_KEY) || '';
    currentScore.language = JSON.parse(localStorage.getItem(LANGUAGES_KEY) || '[]');
    currentScore.difficulty = localStorage.getItem(DIFFICULTY_KEY) || '';

    localStorage.setItem(CURRENT_SCORE_KEY, JSON.stringify(currentScore));
  }

  setCurrentScoreName(name = 'LJB') {
    const currentScore = this.getCurrentScore();
    if (currentScore) {
      currentScore.name = name;
      localStorage.setItem(CURRENT_SCORE_KEY, JSON.stringify(currentScore));
    }
  }
  addToHighScores() {
    // add currentScore to scores and remove it
    const currentScore = this.getCurrentScore();
    if (!currentScore) return;

    const scores = this.getScores();
    scores.push(currentScore);
    scores.sort((a, b) => b.score - a.score);

    localStorage.setItem(SCORES_KEY, JSON.stringify(scores));

    // remove current score
    this.removeCurrentCore()
  }
}

const scoreManager = new ScoreManager()
export default scoreManager
