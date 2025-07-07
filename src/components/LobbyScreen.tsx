// src/components/LobbyScreen.tsx
import { Zap } from 'lucide-react';
import React from 'react';
import { useLocale } from '../context/LocaleContext';
import type { LobbyScreenProps } from '../types'; // Import types

const LobbyScreen: React.FC<LobbyScreenProps> = ({ startGame, message, leaderboard }) => {
    const { t, locale, setLocale } = useLocale();

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">{t('gameTitle')}</h2>

            {/* Language Selector */}
            <div className="flex justify-center mb-4">
                <button
                    className={`px-3 py-1 rounded-l-md text-sm font-semibold transition-colors duration-200
                                ${locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => setLocale('en')}
                >
                    English
                </button>
                <button
                    className={`px-3 py-1 rounded-r-md text-sm font-semibold transition-colors duration-200
                                ${locale === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => setLocale('es')}
                >
                    Español
                </button>
            </div>

            <button
                className="w-full py-3 px-6 text-xl font-bold rounded-xl cursor-pointer transition-all duration-300 shadow-lg uppercase
                           bg-purple-600 hover:bg-purple-700 active:bg-purple-800 border-b-4 border-purple-800 flex items-center justify-center gap-2"
                onClick={startGame}
            >
                {t('startButton')} <Zap size={24} />
            </button>
            <p className="text-lg text-yellow-300">{message}</p>

            {/* Top Math Masters Display */}
            {leaderboard.length > 0 && (
                <div className="mt-8 bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-inner">
                    <h3 className="text-2xl font-bold mb-3 text-center">{t('topScoresTitle')}</h3>
                    <ul className="text-left space-y-2">
                        {leaderboard.map((entry, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-700 bg-opacity-70 p-2 rounded-md">
                                <span className="font-bold text-xl text-yellow-300">#{index + 1}</span>
                                <span className="font-mono text-xl">{entry.score} {t('pointsShort')}</span>
                                <span className="text-sm text-gray-400">{entry.date} {entry.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LobbyScreen;
