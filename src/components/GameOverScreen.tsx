// src/components/GameOverScreen.tsx
import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { type GameOverScreenProps } from '../types'; // Import types

const GameOverScreen: React.FC<GameOverScreenProps> = ({ message, score, bestScore, setGameStatus, setShowConfetti }) => {
    const { t } = useLocale();

    return (
        <>
            {/* Game Over Message */}
            <div className="text-2xl font-bold text-yellow-300 mt-5 min-h-[40px]">
                {message}
            </div>

            {/* Score Section */}
            <div className="mt-4 mb-6 flex justify-around items-center">
                {score === bestScore && score > 0 ? ( // If current score is the best score and positive
                    <div className="text-xl font-bold text-gray-200">
                        {t('bestScoreLabel')} <span className="text-green-300 text-3xl">{bestScore}</span>
                    </div>
                ) : ( // Otherwise, show both current and best if best exists
                    <>
                        <div className="text-xl font-bold text-gray-200">
                            {t('yourScoreLabel')} <span className="text-yellow-300 text-3xl">{score}</span>
                        </div>
                        {bestScore > 0 && (
                            <div className="text-xl font-bold text-gray-200">
                                {t('bestScoreLabel')} <span className="text-green-300 text-3xl">{bestScore}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Play Again Button */}
            <button
                className="mt-5 py-4 px-8 text-2xl font-bold rounded-xl cursor-pointer transition-all duration-300 shadow-lg uppercase
                           bg-purple-600 hover:bg-purple-700 active:bg-purple-800 border-b-4 border-purple-800"
                onClick={() => {
                    setGameStatus('lobby'); // Go back to lobby
                    setShowConfetti(false); // Hide confetti when returning to lobby
                }}
            >
                {t('playAgainButton')}
            </button>
        </>
    );
};

export default GameOverScreen;
