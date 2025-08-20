import React from 'react';
import type { AnalysisResult } from '../types';

const DataPoint: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className }) => (
    <div className="flex justify-between items-baseline">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className={`font-mono font-semibold text-gray-100 ${className}`}>{typeof value === 'number' ? value.toFixed(2) : value}</span>
    </div>
);

const RSIBar: React.FC<{ value: number }> = ({ value }) => {
    const percentage = Math.max(0, Math.min(100, value));
    let colorClass = 'bg-blue-500';
    if (value > 70) colorClass = 'bg-red-500';
    if (value < 30) colorClass = 'bg-green-500';

    return (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
            <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

export const AnalysisDisplay: React.FC<{ analysis: AnalysisResult }> = ({ analysis }) => {
    const { pivotPoints, rsi, movingAverages, marketSentiment, newsSummary } = analysis;

    const sentimentConfig = {
        Bullish: { textColor: 'text-green-400' },
        Bearish: { textColor: 'text-red-400' },
        Neutral: { textColor: 'text-gray-300' },
    };
    const currentSentimentConfig = sentimentConfig[marketSentiment] || sentimentConfig.Neutral;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-lg">
                <h4 className="font-bold text-blue-400 mb-4">Pivot Points</h4>
                <div className="space-y-2">
                    <DataPoint label="Resistance 3 (R3)" value={pivotPoints.r3} className="text-red-400" />
                    <DataPoint label="Resistance 2 (R2)" value={pivotPoints.r2} className="text-red-400" />
                    <DataPoint label="Resistance 1 (R1)" value={pivotPoints.r1} className="text-red-400" />
                    <hr className="border-gray-700 my-2" />
                    <DataPoint label="Pivot Point (PP)" value={pivotPoints.pp} className="text-yellow-400" />
                    <hr className="border-gray-700 my-2" />
                    <DataPoint label="Support 1 (S1)" value={pivotPoints.s1} className="text-green-400" />
                    <DataPoint label="Support 2 (S2)" value={pivotPoints.s2} className="text-green-400" />
                    <DataPoint label="Support 3 (S3)" value={pivotPoints.s3} className="text-green-400" />
                </div>
            </div>

            <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-lg">
                <h4 className="font-bold text-blue-400 mb-4">Relative Strength Index (RSI)</h4>
                <div className="text-center">
                    <p className="text-4xl font-bold font-mono">{rsi.value.toFixed(2)}</p>
                    <p className={`font-semibold mt-1 ${
                        rsi.interpretation === 'Overbought' ? 'text-red-400' :
                        rsi.interpretation === 'Oversold' ? 'text-green-400' :
                        'text-gray-300'
                    }`}>{rsi.interpretation}</p>
                    <RSIBar value={rsi.value} />
                     <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Oversold (30)</span>
                        <span>Overbought (70)</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-lg">
                <h4 className="font-bold text-blue-400 mb-4">Moving Averages (SMA)</h4>
                 <div className="space-y-4">
                    <DataPoint label="50-Day MA" value={movingAverages.ma50} />
                    <DataPoint label="200-Day MA" value={movingAverages.ma200} />
                 </div>
                <p className="text-xs text-gray-500 mt-4">
                    {analysis.currentPrice > movingAverages.ma50 ? "Price is above 50-day MA (short-term bullish)." : "Price is below 50-day MA (short-term bearish)."}
                </p>
                 <p className="text-xs text-gray-500 mt-2">
                    {analysis.currentPrice > movingAverages.ma200 ? "Price is above 200-day MA (long-term bullish)." : "Price is below 200-day MA (long-term bearish)."}
                </p>
            </div>
            
            {marketSentiment && newsSummary && (
                <div className="md:col-span-3 bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-lg">
                    <h4 className="font-bold text-blue-400 mb-4">Deep Search Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        <div className="md:col-span-3 text-center md:border-r md:border-gray-800/50 md:pr-6">
                            <h5 className="text-sm text-gray-400 mb-1">Market Sentiment</h5>
                            <p className={`text-2xl font-bold ${currentSentimentConfig.textColor}`}>{marketSentiment}</p>
                        </div>
                        <div className="md:col-span-9">
                            <h5 className="font-semibold text-gray-300 mb-2">Key Factors & News Summary</h5>
                            <p className="text-sm text-gray-400 leading-relaxed">{newsSummary}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};