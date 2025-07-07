// src/ActiveGameScreen.tsx
import React from 'react';
import { useLocale } from '../context/LocaleContext';
import type { ActiveGameScreenProps } from '../types';

const ActiveGameScreen: React.FC<ActiveGameScreenProps> = ({ score, currentProblem, problemFeedbackClass, timerWidth, timerTransitionEnabled, gameActive, handleAnswer }) => {
    const { t } = useLocale();
    const TIME_PER_QUESTION = 2000; // Needs to be consistent with App.tsx

    return (
        <>
            {/* Score Display */}
            <div className="text-4xl font-bold mb-5 text-gray-100 drop-shadow-lg">
                {t('scoreLabel')} {score}
            </div>

            {/* Timer Bar Container */}
            <div className="w-full h-4 bg-white bg-opacity-20 rounded-lg mb-5 overflow-hidden shadow-inner">
                <div
                    className="h-full bg-yellow-400 rounded-lg"
                    style={{
                        width: `${timerWidth}%`,
                        transition: timerTransitionEnabled ? `width ${TIME_PER_QUESTION / 1000}s linear` : 'none'
                    }}
                ></div>
            </div>

            {/* Problem Display */}
            <div className={`text-5xl font-bold mb-8 text-white bg-white bg-opacity-10 p-5 rounded-xl min-h-[90px] flex items-center justify-center shadow-inner transition-colors duration-100 ${problemFeedbackClass}`}>
                {currentProblem ? currentProblem.question : 'Loading...'}
            </div>

            {/* Buttons Container */}
            <div className="flex justify-around gap-4 mb-5">
                <button
                    className="flex-1 py-4 px-6 text-2xl font-bold rounded-xl cursor-pointer transition-all duration-300 shadow-lg uppercase
                               bg-green-600 hover:bg-green-700 active:bg-green-800 border-b-4 border-green-800
                               hover:translate-y-[-3px] hover:shadow-xl active:translate-y-[1px] active:border-b-1
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleAnswer(true)}
                    disabled={!gameActive}
                >
                    {t('true')}
                </button>
                <button
                    className="flex-1 py-4 px-6 text-2xl font-bold rounded-xl cursor-pointer transition-all duration-300 shadow-lg uppercase
                               bg-red-600 hover:bg-red-700 active:bg-red-800 border-b-4 border-red-800
                               hover:translate-y-[-3px] hover:shadow-xl active:translate-y-[1px] active:border-b-1
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleAnswer(false)}
                    disabled={!gameActive}
                >
                    {t('false')}
                </button>
            </div>
        </>
    );
};

export default ActiveGameScreen;
