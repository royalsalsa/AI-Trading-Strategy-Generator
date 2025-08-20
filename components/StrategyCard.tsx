

import React, { useState, useEffect } from 'react';
import type { AnalysisResult, Source } from '../types';
import { TrendUpIcon, TrendDownIcon, HoldIcon, SourceIcon } from './icons';

interface StrategyCardProps {
    strategy: AnalysisResult['strategy'];
    currentPrice: number;
    sources?: Source[];
}

const strategyConfig = {
    BUY: {
        icon: <TrendUpIcon className="h-10 w-10 text-green-300" />,
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-300',
        borderColor: 'border-green-500',
    },
    SELL: {
        icon: <TrendDownIcon className="h-10 w-10 text-red-300" />,
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-300',
        borderColor: 'border-red-500',
    },
    HOLD: {
        icon: <HoldIcon className="h-10 w-10 text-gray-300" />,
        bgColor: 'bg-gray-500/20',
        textColor: 'text-gray-300',
        borderColor: 'border-gray-500',
    },
};

const StrategyDataPoint: React.FC<{ label: string; value: number; className?: string }> = ({ label, value, className }) => (
    <div className="flex justify-between items-baseline">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className={`font-mono font-semibold text-lg text-gray-100 ${className}`}>
            ${value.toFixed(2)}
        </span>
    </div>
);


export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, currentPrice, sources }) => {
    const config = strategyConfig[strategy.signal] || strategyConfig.HOLD;
    
    // State for live price simulation
    const [livePrice, setLivePrice] = useState(currentPrice);
    const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

    useEffect(() => {
        // Reset simulation when the underlying asset changes
        setLivePrice(currentPrice);
        setPriceDirection('neutral');

        let lastPrice = currentPrice;

        const intervalId = setInterval(() => {
            setLivePrice(prevLivePrice => {
                // Simulate a small fluctuation, e.g., +/- 0.05% of the price
                const fluctuation = prevLivePrice * (Math.random() - 0.5) * 0.001;
                const newPrice = prevLivePrice + fluctuation;

                // Determine direction
                if (newPrice > lastPrice) {
                    setPriceDirection('up');
                } else if (newPrice < lastPrice) {
                    setPriceDirection('down');
                }
                
                lastPrice = newPrice;
                return newPrice;
            });
        }, 2500); // Update every 2.5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [currentPrice]);

    const directionConfig = {
        up: {
            textColor: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30'
        },
        down: {
            textColor: 'text-red-400',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30'
        },
        neutral: {
            textColor: 'text-gray-200',
            bgColor: 'bg-gray-500/10',
            borderColor: 'border-gray-500/30'
        }
    };
    const currentDirection = directionConfig[priceDirection];
    
    const primarySource = sources?.[0]?.web?.uri;
    let sourceDisplay: string | null = null;
    if (primarySource) {
        try {
            sourceDisplay = new URL(primarySource).hostname.replace(/^www\./, '');
        } catch {
            sourceDisplay = primarySource;
        }
    }

    return (
        <div className={`p-6 rounded-lg shadow-lg h-full flex flex-col justify-between border ${config.borderColor} ${config.bgColor}`}>
            <div>
                 {/* Live Price Ticker */}
                <div className={`p-3 mb-4 rounded-lg border transition-colors duration-300 ${currentDirection.bgColor} ${currentDirection.borderColor}`}>
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm font-medium text-gray-400">Live Price</span>
                        <div className={`relative font-mono font-semibold text-2xl transition-colors duration-300 ${currentDirection.textColor}`}>
                            ${livePrice.toFixed(2)}
                            {/* Pulsing indicator */}
                            <span className={`absolute -right-3.5 top-1.5 w-2 h-2 ${priceDirection === 'neutral' ? 'bg-gray-400' : priceDirection === 'up' ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-pulse`}></span>
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Generated Strategy</h3>
                <div className="flex items-center space-x-4 mb-4">
                    {config.icon}
                    <span className={`text-4xl font-bold ${config.textColor}`}>{strategy.signal}</span>
                </div>
                <p className="text-gray-300 text-sm mb-6">{strategy.description}</p>
                
                {strategy.signal !== 'HOLD' && (
                    <div className="space-y-3 pt-4 border-t border-gray-700">
                        <StrategyDataPoint label="Entry Price" value={strategy.entryPrice} className="text-yellow-300" />
                        <StrategyDataPoint label="Stop Loss" value={strategy.stopLoss} className="text-red-400" />
                        <StrategyDataPoint label="Take Profit 1" value={strategy.takeProfit1} className="text-green-400" />
                        <StrategyDataPoint label="Take Profit 2" value={strategy.takeProfit2} className="text-green-400" />
                    </div>
                )}
            </div>
             {sourceDisplay && (
                <div className="mt-6 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center text-xs text-gray-400">
                        <SourceIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="mr-1">Data from:</span>
                        <a 
                            href={primarySource} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-medium text-gray-300 hover:text-blue-400 truncate"
                            title={primarySource}
                        >
                            {sourceDisplay}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};