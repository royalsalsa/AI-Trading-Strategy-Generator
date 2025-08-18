import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { HistoryItem } from '../types';
import { TrashIcon, TrendUpIcon, TrendDownIcon, HoldIcon, SearchIcon, SourceIcon, ExternalLinkIcon } from './icons';

const formatRelativeTime = (isoDate: string): string => {
    const now = new Date();
    const date = new Date(isoDate);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 30) return 'just now';

    let interval = seconds / 31536000;
    if (interval > 1) {
        const years = Math.floor(interval);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const months = Math.floor(interval);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const days = Math.floor(interval);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const hours = Math.floor(interval);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const minutes = Math.floor(interval);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    const secs = Math.floor(seconds);
    return `${secs} second${secs > 1 ? 's' : ''} ago`;
};

const generateSparklineData = (currentPrice: number): { price: number }[] => {
    const data: { price: number }[] = [];
    const points = 20;
    let price = currentPrice * (1 + (Math.random() - 0.5) * 0.05);

    for (let i = 0; i < points - 1; i++) {
        data.push({ price: parseFloat(price.toFixed(2)) });
        price *= (1 + (Math.random() - 0.48) * 0.08);
    }
    data.push({ price: parseFloat(currentPrice.toFixed(2)) });
    return data;
};


const SignalBadge: React.FC<{ signal: HistoryItem['signal'] }> = ({ signal }) => {
    const config = {
        BUY: {
            icon: <TrendUpIcon className="h-4 w-4 mr-1.5" />,
            bgColor: 'bg-green-500/20',
            textColor: 'text-green-300',
            borderColor: 'border-green-500/30'
        },
        SELL: {
            icon: <TrendDownIcon className="h-4 w-4 mr-1.5" />,
            bgColor: 'bg-red-500/20',
            textColor: 'text-red-300',
            borderColor: 'border-red-500/30'
        },
        HOLD: {
            icon: <HoldIcon className="h-4 w-4 mr-1.5" />,
            bgColor: 'bg-gray-500/20',
            textColor: 'text-gray-300',
            borderColor: 'border-gray-500/30'
        },
    };

    const currentConfig = config[signal] || config.HOLD;

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold border ${currentConfig.bgColor} ${currentConfig.textColor} ${currentConfig.borderColor}`}>
            {currentConfig.icon}
            {signal}
        </span>
    );
};

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
    const sparklineData = generateSparklineData(item.currentPrice);
    const trendColor = sparklineData.length > 1 && sparklineData[sparklineData.length - 1].price >= sparklineData[0].price ? '#22c55e' : '#ef4444';

    return (
        <div className="bg-[#161b22] border border-gray-800 rounded-xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/10 hover:border-gray-700 hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xl text-white">{item.ticker}</span>
                    <SignalBadge signal={item.signal} />
                </div>
                <p className="text-xs text-gray-400 mb-4">{formatRelativeTime(item.timestamp)}</p>

                <div className="mb-4">
                    <p className="text-sm text-gray-500">Price at signal</p>
                    <p className="text-3xl font-mono font-semibold text-gray-100">${item.currentPrice.toFixed(2)}</p>
                </div>
            </div>

            <div className="h-16 w-full mb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <Line type="monotone" dataKey="price" stroke={trendColor} strokeWidth={2.5} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Take Profit</p>
                        <p className="font-mono font-semibold text-lg text-green-400">{item.takeProfit > 0 ? `$${item.takeProfit.toFixed(2)}` : '—'}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-gray-400 text-xs uppercase tracking-wider">Stop Loss</p>
                        <p className="font-mono font-semibold text-lg text-red-400">{item.stopLoss > 0 ? `$${item.stopLoss.toFixed(2)}` : '—'}</p>
                    </div>
                </div>
                {item.sources && item.sources.length > 0 && (
                     <div className="relative group flex justify-center items-center mt-4 cursor-pointer">
                        <SourceIcon className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <span className="ml-2 text-xs text-gray-400 group-hover:text-white transition-colors">Data Sources</span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-[#0d1117] border border-gray-700 rounded-lg shadow-2xl p-3 z-10 hidden group-hover:block transition-opacity duration-300 text-left opacity-0 group-hover:opacity-100">
                            <h5 className="text-sm font-bold text-gray-200 mb-2 border-b border-gray-700 pb-1">Data Sources</h5>
                            <ul className="space-y-1 max-h-40 overflow-y-auto">
                                {item.sources.map((source, index) => {
                                    let displayTitle = source.web?.title;
                                    try {
                                        if (!displayTitle && source.web?.uri) {
                                            displayTitle = new URL(source.web.uri).hostname.replace('www.', '');
                                        }
                                    } catch {
                                        displayTitle = source.web?.uri;
                                    }
                                    return (
                                    <li key={index} className="text-xs">
                                        <a 
                                            href={source.web?.uri} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-blue-300 flex items-start gap-2 group/link"
                                            title={source.web?.title || source.web?.uri}
                                        >
                                            <ExternalLinkIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500 group-hover/link:text-blue-400" />
                                            <span className="truncate block">{displayTitle || 'Unknown source'}</span>
                                        </a>
                                    </li>
                                )})}
                            </ul>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export const HistoryPage: React.FC<{ history: HistoryItem[], onClearHistory: () => void }> = ({ history, onClearHistory }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHistory = history.filter(item =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (history.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 animate-fade-in max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold">Signal History is Empty</h2>
                <p className="mt-2">Generate a new signal on the 'Signals' page to see its history here.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white w-full sm:w-auto">Signal History</h2>
                <div className="flex sm:justify-end items-center gap-4 w-full sm:w-auto">
                     <div className="relative w-full sm:w-64">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by ticker..."
                            aria-label="Search signal history by ticker"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#0d1117] text-white border border-gray-700 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <button
                        onClick={onClearHistory}
                        className="flex items-center bg-red-600/80 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:bg-red-400/50 disabled:cursor-not-allowed transition duration-200 text-sm flex-shrink-0"
                    >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Clear History
                    </button>
                </div>
            </div>

            {filteredHistory.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHistory.map((item) => (
                        <HistoryCard key={item.id} item={item} />
                    ))}
                 </div>
            ) : (
                 <div className="text-center py-16 text-gray-500 animate-fade-in">
                    <h2 className="text-2xl font-semibold">No Results Found</h2>
                    <p className="mt-2">No signals match your search for "{searchQuery}".</p>
                </div>
            )}
        </div>
    );
};