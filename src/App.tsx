// src/App.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ActiveGameScreen from './components/ActiveGameScreen';
import Confetti from './components/Confetti';
import GameOverScreen from './components/GameOverScreen';
import LobbyScreen from './components/LobbyScreen';
import { useLocale } from './context/LocaleContext';
import type { LeaderboardEntry, Problem } from './types';

// Main App component for the Math Beast game
const App: React.FC = () => {
    // Game state variables
    const [score, setScore] = useState<number>(0);
    const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
    const [gameActive, setGameActive] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [problemFeedbackClass, setProblemFeedbackClass] = useState<string>('');
    const [timerWidth, setTimerWidth] = useState<number>(100);
    const [timerTransitionEnabled, setTimerTransitionEnabled] = useState<boolean>(true);
    const [gameStatus, setGameStatus] = useState<'lobby' | 'active' | 'finished'>('lobby');

    // Leaderboard specific states
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [bestScore, setBestScore] = useState<number>(0);

    // Confetti state
    const [showConfetti, setShowConfetti] = useState<boolean>(false);
    // Refs for timer interval and latest score/gameActive state (to avoid stale closures in callbacks)
    const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scoreRef = useRef<number>(0);
    const gameActiveRef = useRef<boolean>(false);
    const currentProblemRef = useRef<Problem | null>(null);

    // Constants for game logic
    const TIME_PER_QUESTION = 2000; // 2 seconds per question
    const MAX_LEADERBOARD_ENTRIES = 5; // Max number of entries in the local leaderboard

    // Access translation function from context
    const { t } = useLocale();

    // --- Refs Update Effects ---
    // These useEffects keep the refs updated with the latest state values,
    // which is crucial for callbacks that depend on these values but don't
    // want to re-create themselves on every render (e.g., event listeners).
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { gameActiveRef.current = gameActive; }, [gameActive]);
    useEffect(() => { currentProblemRef.current = currentProblem; }, [currentProblem]);

    // --- Leaderboard Logic ---
    useEffect(() => {
        // Load leaderboard from localStorage on component mount
        const storedLeaderboard = localStorage.getItem('mathBeastLeaderboard');
        if (storedLeaderboard) {
            try {
                const parsedLeaderboard: LeaderboardEntry[] = JSON.parse(storedLeaderboard);
                setLeaderboard(parsedLeaderboard);
                if (parsedLeaderboard.length > 0) {
                    setBestScore(parsedLeaderboard[0].score); // Set best score from loaded leaderboard
                }
            } catch (e) {
                console.error("Error parsing leaderboard from localStorage:", e);
                localStorage.removeItem('mathBeastLeaderboard'); // Clear corrupted data
            }
        }
    }, []);

    /**
     * Updates the local leaderboard with a new score.
     * Sorts scores and keeps only the top N entries.
     */
    const updateLeaderboard = useCallback((newScore: number) => {
        const now = new Date();
        const newEntry: LeaderboardEntry = {
            score: newScore,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
        };

        const updatedLeaderboard = [...leaderboard, newEntry]
            .sort((a, b) => b.score - a.score) // Sort descending by score
            .slice(0, MAX_LEADERBOARD_ENTRIES); // Keep only top N entries

        setLeaderboard(updatedLeaderboard);
        localStorage.setItem('mathBeastLeaderboard', JSON.stringify(updatedLeaderboard));

        // Update bestScore if the new score is higher
        if (newScore > bestScore) {
            setBestScore(newScore);
        }
    }, [leaderboard, bestScore]);

    // --- Game Logic Helper Functions ---

    /**
     * Generates a random integer between min (inclusive) and max (inclusive).
     */
    const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

    /**
     * Generates a random arithmetic operator.
     */
    const getRandomOperator = (): '+' | '-' | '*' => {
        const operators: ('+' | '-' | '*')[] = ['+', '-', '*'];
        return operators[getRandomInt(0, operators.length - 1)];
    };

    /**
     * Calculates the result of a simple arithmetic expression.
     */
    const calculateResult = (num1: number, operator: '+' | '-' | '*', num2: number): number => {
        switch (operator) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            default: return 0;
        }
    };

    /**
     * Generates a new math problem (question and its true/false answer).
     */
    const generateProblem = useCallback((): Problem => {
        const num1 = getRandomInt(1, 15);
        const num2 = getRandomInt(1, 15);
        const operator = getRandomOperator();
        const actualResult = calculateResult(num1, operator, num2);

        let questionText: string;
        let isTrueStatement: boolean;

        if (Math.random() < 0.5) {
            questionText = `${num1} ${operator} ${num2} = ${actualResult}`;
            isTrueStatement = true;
        } else {
            let fakeResult: number;
            do {
                fakeResult = actualResult + getRandomInt(-5, 5);
                if (fakeResult === actualResult) {
                    fakeResult += (Math.random() < 0.5 ? 1 : -1);
                }
            } while (fakeResult === actualResult);

            questionText = `${num1} ${operator} ${num2} = ${fakeResult}`;
            isTrueStatement = false;
        }
        return { question: questionText, answer: isTrueStatement };
    }, []);

    /**
     * Ends the game and displays a message based on performance.
     * @param {string} baseMsg - The base message (e.g., "Time's up!" or "Oops!").
     */
    const endGame = useCallback((baseMsg: string) => {
        setGameActive(false);
        setGameStatus('finished');
        if (timerIntervalRef.current) {
            clearTimeout(timerIntervalRef.current);
        }
        setTimerWidth(0);
        setTimerTransitionEnabled(true);

        let finalMessage: string = baseMsg;
        const currentScore: number = scoreRef.current;
        let triggerConfetti: boolean = false;

        // General encouragement or new high score
        if (currentScore > bestScore) {
            finalMessage = t('newBestScore', { score: currentScore });
            triggerConfetti = true;
        } else if (currentScore > 0) {
            finalMessage = t('gameOverLimits');
        } else {
            finalMessage = t('oopsDontGiveUp');
        }

        setMessage(finalMessage);
        setShowConfetti(triggerConfetti);

        if (currentScore > 0) {
            updateLeaderboard(currentScore);
        }
    }, [updateLeaderboard, bestScore, t]);

    /**
     * Displays the current problem and resets the timer bar.
     * Starts the local timer for the question.
     */
    const displayProblem = useCallback(() => {
        const newProblem: Problem = generateProblem();
        setCurrentProblem(newProblem);
        setProblemFeedbackClass('');
        setMessage('');
        setShowConfetti(false);

        setTimerTransitionEnabled(false);
        setTimerWidth(100);

        // Use requestAnimationFrame to ensure the browser renders the 100% width
        // before re-enabling transition and starting the countdown.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimerTransitionEnabled(true);
                setTimerWidth(0);
            });
        });

        if (timerIntervalRef.current) {
            clearTimeout(timerIntervalRef.current);
        }
        timerIntervalRef.current = setTimeout(() => {
            if (gameActiveRef.current) {
                endGame(t('timesUp'));
            }
        }, TIME_PER_QUESTION);
    }, [generateProblem, endGame, t]);

    /**
     * Handles the user's answer choice.
     * Updates local score and triggers next problem or game over.
     * @param {boolean} userAnswer - True if user clicked 'True', false if 'False'.
     */
    const handleAnswer = useCallback((userAnswer: boolean) => {
        if (!gameActiveRef.current || !currentProblemRef.current) return;

        if (timerIntervalRef.current) {
            clearTimeout(timerIntervalRef.current);
        }

        const isCorrect = (userAnswer === currentProblemRef.current.answer);

        if (isCorrect) {
            setScore(prevScore => prevScore + 1);
            setProblemFeedbackClass('bg-green-500/30');
            setTimeout(() => {
                if (gameActiveRef.current) displayProblem();
            }, 100);
        } else {
            setProblemFeedbackClass('bg-red-500/30');
            endGame(t('oops'));
        }
    }, [displayProblem, endGame, t]);

    /**
     * Initializes or resets the game.
     */
    const startGame = useCallback(() => {
        setScore(0);
        setGameActive(true);
        setMessage('');
        setProblemFeedbackClass('');
        setGameStatus('active');
        setShowConfetti(false);
        displayProblem();
    }, [displayProblem]);

    // --- Keyboard Event Listener ---
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!gameActiveRef.current) return;
            if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 't') {
                handleAnswer(true);
            } else if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'f') {
                handleAnswer(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleAnswer]);

    // Initial setup: display a message and ensure timer bar is full
    useEffect(() => {
        if (!gameActive) {
            setCurrentProblem({ question: t('readyMessage'), answer: false });
            setTimerWidth(100);
            setTimerTransitionEnabled(true);
        }
    }, [gameActive, t]);


    // --- Render Logic ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-600 text-white overflow-hidden font-inter p-4">
            {showConfetti && <Confetti show={showConfetti} />}
            <div className="bg-black bg-opacity-30 p-8 rounded-2xl shadow-2xl text-center w-full max-w-md border-2 border-white border-opacity-20 relative animate-fade-in">
                {gameStatus === 'lobby' && (
                    <LobbyScreen
                        startGame={startGame}
                        message={message}
                        leaderboard={leaderboard}
                        bestScore={bestScore}
                    />
                )}

                {gameStatus === 'active' && (
                    <ActiveGameScreen
                        score={score}
                        currentProblem={currentProblem}
                        problemFeedbackClass={problemFeedbackClass}
                        timerWidth={timerWidth}
                        timerTransitionEnabled={timerTransitionEnabled}
                        gameActive={gameActive}
                        handleAnswer={handleAnswer}
                    />
                )}

                {gameStatus === 'finished' && (
                    <GameOverScreen
                        message={message}
                        score={score}
                        bestScore={bestScore}
                        setGameStatus={setGameStatus}
                        setShowConfetti={setShowConfetti}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
