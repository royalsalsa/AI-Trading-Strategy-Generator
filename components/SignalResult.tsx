import React from 'react';
import type { AnalysisResult } from '../types';

interface SignalResultProps {
    analysis: AnalysisResult;
}

const InfoCard: React.FC<{
    label: string;
    value: string;
    bgColor: string;
    textColor: string;
}> = ({ label, value, bgColor, textColor }) => (
    <div className={`flex-1 p-4 rounded-lg ${bgColor}`}>
        <p className="text-xs text-gray-400 uppercase">{label}</p>
        <p className={`text-2xl font-semibold ${textColor}`}>{value}</p>
    </div>
);

export const SignalResult: React.FC<SignalResultProps> = ({ analysis }) => {
    const { strategy } = analysis;
    const isBuy = strategy.signal === 'BUY';
    const directionColor = isBuy ? 'text-green-400' : 'text-red-400';

    const formatPrice = (price: number) => {
        return price.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 4 });
    };
    
    const formattedTimestamp = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
        timeZoneName: 'short',
    }).format(new Date()).replace('UTC', '(UTC+0)');


    return (
        <div className="bg-[#0D1117] border border-gray-700/50 rounded-xl shadow-2xl space-y-5 p-5">
            <div className="flex justify-between items-center border-b border-gray-700/50 pb-3">
                <p className="font-semibold">
                    Direction: <span className={directionColor}>{strategy.signal}</span>
                </p>
                <p className="text-sm text-gray-400">
                    Update: {formattedTimestamp}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <InfoCard
                    label={strategy.signal}
                    value={formatPrice(strategy.entryPrice)}
                    bgColor="bg-slate-800"
                    textColor="text-white"
                />
                <InfoCard
                    label="TP1"
                    value={formatPrice(strategy.takeProfit1)}
                    bgColor="bg-green-600/20"
                    textColor="text-green-400"
                />
                <InfoCard
                    label="TP2"
                    value={formatPrice(strategy.takeProfit2)}
                    bgColor="bg-green-600/20"
                    textColor="text-green-400"
                />
                <InfoCard
                    label="SL"
                    value={formatPrice(strategy.stopLoss)}
                    bgColor="bg-red-600/20"
                    textColor="text-red-400"
                />
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-300">Confidence</p>
                    <p className="text-sm font-semibold text-violet-400">{strategy.confidence}%</p>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-violet-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${strategy.confidence}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};