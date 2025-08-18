import React from 'react';

export const WelcomeGraphic: React.FC = () => (
    <div className="mt-8 mx-auto w-full max-w-2xl">
        <svg 
            viewBox="0 0 600 300" 
            xmlns="http://www.w3.org/2000/svg" 
            className="rounded-lg shadow-xl w-full opacity-40"
            aria-label="Stylized financial chart"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(31, 41, 55)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(17, 24, 39)', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#34d399', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            <rect width="600" height="300" rx="8" fill="url(#bg-gradient)" />

            <g transform="translate(40, 260) scale(1, -1)">
                <polyline
                    points="0,60 50,80 100,70 150,110 200,100 250,140 300,160 350,150 400,180 450,170 500,200 520,220"
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="3"
                    filter="url(#glow)"
                />
            </g>

            <rect x="500" y="40" width="60" height="30" rx="4" fill="#374151" />
            <text x="530" y="60" fontFamily="monospace" fontSize="12" fill="#d1d5db" textAnchor="middle">BUY</text>
            
            <rect x="500" y="80" width="60" height="30" rx="4" fill="#374151" />
            <text x="530" y="100" fontFamily="monospace" fontSize="12" fill="#d1d5db" textAnchor="middle">SELL</text>
            
            <g opacity="0.5">
                <line x1="40" y1="40" x2="480" y2="40" stroke="#4b5563" strokeDasharray="4" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#4b5563" strokeDasharray="4" />
                <line x1="40" y1="160" x2="480" y2="160" stroke="#4b5563" strokeDasharray="4" />
                <line x1="40" y1="220" x2="480" y2="220" stroke="#4b5563" strokeDasharray="4" />
            </g>
        </svg>
    </div>
);