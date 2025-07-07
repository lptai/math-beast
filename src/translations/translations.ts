// src/translations.ts
import type { Translations } from '../types';

const translations: Translations = {
    en: {
        gameTitle: "Math Beast",
        startButton: "Let's Break! ⚡",
        readyMessage: "Ready to crunch numbers? Click \"Let's Break! ⚡\"",
        topScoresTitle: "Top Math Masters",
        playAgainButton: "Unleash the Math Beast!",
        scoreLabel: "Score:",
        yourScoreLabel: "Your Score:",
        bestScoreLabel: "Best Score:",
        newBestScore: "🏆 New Best Score: {score} points!",
        gameOverLimits: "Game Over! Push your limits!",
        oopsDontGiveUp: "Oops! Don't give up, math warrior!",
        timesUp: "Time's up!",
        oops: "Oops!", // Base message for incorrect answer
        true: "True",
        false: "False",
        pointsShort: "pts", // Short for points in leaderboard
    },
    es: {
        gameTitle: "Bestia Matemática",
        startButton: "¡A Romper! ⚡",
        readyMessage: "¿Listo para triturar números? ¡Haz clic en \"¡A Romper! ⚡\"",
        topScoresTitle: "Maestros de las Matemáticas",
        playAgainButton: "¡Desata la Bestia Matemática!",
        scoreLabel: "Puntuación:",
        yourScoreLabel: "Tu Puntuación:",
        bestScoreLabel: "Mejor Puntuación:",
        newBestScore: "🏆 ¡Nueva Mejor Puntuación: {score} puntos!",
        gameOverLimits: "¡Juego Terminado! ¡Supera tus límites!",
        oopsDontGiveUp: "¡Uy! ¡No te rindas, guerrero matemático!",
        timesUp: "¡Se acabó el tiempo!",
        oops: "¡Uy!", // Base message for incorrect answer
        true: "Verdadero",
        false: "Falso",
        pointsShort: "pts",
    }
};
export default translations;
