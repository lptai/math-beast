// src/Confetti.tsx
import React from 'react';
import type { ConfettiProps } from '../types';

const Confetti: React.FC<ConfettiProps> = ({ show }) => {
    if (!show) return null;

    const confettiPieces = Array.from({ length: 150 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
            transform: `rotate(${Math.random() * 360}deg)`,
        };
        return <div key={i} className="confetti-piece" style={style}></div>;
    });

    return (
        <div className="confetti-container">
            {confettiPieces}
            <style>{`
                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: 9999;
                }
                .confetti-piece {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: #f00; /* Default color, overridden by inline style */
                    opacity: 0;
                    animation: fall linear infinite;
                    border-radius: 50%;
                }
                @keyframes fall {
                    0% {
                        transform: translateY(-100px) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Confetti;
