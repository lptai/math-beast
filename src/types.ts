// src/types.ts

/**
 * Represents a mathematical problem in the game.
 */
export interface Problem {
  question: string;
  answer: boolean;
}

/**
* Represents an entry in the local leaderboard.
*/
export interface LeaderboardEntry {
  score: number;
  date: string;
  time: string;
}

/**
* Defines the structure of a single language's translations.
*/
export interface LanguageStrings {
  gameTitle: string;
  startButton: string;
  readyMessage: string;
  topScoresTitle: string;
  playAgainButton: string;
  scoreLabel: string;
  yourScoreLabel: string;
  bestScoreLabel: string;
  newBestScore: string;
  gameOverLimits: string;
  oopsDontGiveUp: string;
  timesUp: string;
  oops: string;
  true: string;
  false: string;
  pointsShort: string;
}

/**
* Defines the overall structure of the translations object.
*/
export interface Translations {
  en: LanguageStrings;
  es: LanguageStrings;
  // Add more languages here as needed
}

/**
* Defines the shape of the context value provided by LocaleContext.
*/
export interface LocaleContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: keyof LanguageStrings, vars?: { [key: string]: string | number }) => string;
}

/**
* Props for the LobbyScreen component.
*/
export interface LobbyScreenProps {
  startGame: () => void;
  message: string;
  leaderboard: LeaderboardEntry[];
  bestScore: number;
}

/**
* Props for the ActiveGameScreen component.
*/
export interface ActiveGameScreenProps {
  score: number;
  currentProblem: Problem | null;
  problemFeedbackClass: string;
  timerWidth: number;
  timerTransitionEnabled: boolean;
  gameActive: boolean;
  handleAnswer: (userAnswer: boolean) => void;
}

/**
* Props for the GameOverScreen component.
*/
export interface GameOverScreenProps {
  message: string;
  score: number;
  bestScore: number;
  setGameStatus: (status: 'lobby' | 'active' | 'finished') => void;
  setShowConfetti: (show: boolean) => void;
}

/**
* Props for the Confetti component.
*/
export interface ConfettiProps {
  show: boolean;
}
