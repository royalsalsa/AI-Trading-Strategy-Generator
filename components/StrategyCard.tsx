
import React from 'react';
import type { AnalysisResult } from '../types';
import { TrendUpIcon, TrendDownIcon, HoldIcon } from './icons';

interface StrategyCardProps {
    strategy: AnalysisResult['strategy'];
    currentPrice: number;
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


export const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, currentPrice }) => {
    const config = strategyConfig[strategy.signal] || strategyConfig.HOLD;

    return (
        <div className={`p-6 rounded-lg shadow-lg h-full flex flex-col justify-between border ${config.borderColor} ${config.bgColor}`}>
            <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Generated Strategy</h3>
                <div className="flex items-center space-x-4 mb-4">
                    {config.icon}
                    <span className={`text-4xl font-bold ${config.textColor}`}>{strategy.signal}</span>
                </div>
                 <div className="text-2xl font-light text-gray-100 mb-4">
                    Price: <span className="font-semibold text-white">${currentPrice.toFixed(2)}</span>
                </div>
                <p className="text-gray-300 text-sm mb-6">{strategy.description}</p>
                
                {strategy.signal !== 'HOLD' && (
                    <div className="space-y-3 pt-4 border-t border-gray-700">
                        <StrategyDataPoint label="Entry Price" value={strategy.entryPrice} className="text-yellow-300" />
                        <StrategyDataPoint label="Stop Loss" value={strategy.stopLoss} className="text-red-400" />
                        <StrategyDataPoint label="Take Profit" value={strategy.takeProfit} className="text-green-400" />
                    </div>
                )}
            </div>
        </div>
    );
};