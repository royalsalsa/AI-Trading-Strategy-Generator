import React from 'react';
import { CloseIcon } from './icons';

interface WatchlistProps {
    items: string[];
    onSelect: (ticker: string) => void;
    onRemove: (ticker: string) => void;
    isLoading: boolean;
}

export const Watchlist: React.FC<WatchlistProps> = ({ items, onSelect, onRemove, isLoading }) => {
    if (items.length === 0) {
        return null; // Don't render anything if the watchlist is empty
    }

    return (
        <div className={`mb-8 animate-fade-in ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 text-left">Watchlist</h3>
            <div className="flex flex-wrap gap-3">
                {items.map(ticker => (
                    <div
                        key={ticker}
                        className="group flex items-center bg-gray-800/50 border border-gray-700/60 rounded-full transition-all duration-200"
                    >
                        <span
                            onClick={() => onSelect(ticker)}
                            className="cursor-pointer pl-4 pr-3 py-1.5 text-sm font-medium text-gray-200 group-hover:text-white"
                        >
                            {ticker}
                        </span>
                        <button
                            onClick={() => onRemove(ticker)}
                            aria-label={`Remove ${ticker} from watchlist`}
                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors duration-200 mr-1"
                        >
                            <CloseIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
