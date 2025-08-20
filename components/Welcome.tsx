
import React from 'react';
import { WelcomeGraphic } from './WelcomeGraphic';
import { SourceIcon } from './icons';

export const Welcome: React.FC = () => (
    <div className="text-center py-12 animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI-Powered Trading Analysis
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
            Enter an asset symbol above to generate a real-time technical analysis and an actionable trading strategy.
        </p>
        
        <WelcomeGraphic />

        <div className="mt-12 bg-[#161b22]/50 border border-dashed border-gray-800 rounded-lg p-6 max-w-3xl mx-auto">
             <div className="flex justify-center items-center gap-x-3">
                <SourceIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-200">Live Data Sources</h3>
            </div>
            <p className="mt-2 text-gray-400 text-sm">
                Our AI leverages Google Search for up-to-the-minute market data, ensuring your strategies are based on the most current information available. Specific sources used for each analysis are cited with the results.
            </p>
        </div>
    </div>
);
