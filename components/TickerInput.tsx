
import React, { useState, useMemo } from 'react';
import { SearchIcon, StarIcon } from './icons';
import { assetCategories } from '../services/assets';

interface TickerInputProps {
    ticker: string;
    setTicker: (ticker: string) => void;
    onSubmit: (ticker: string) => void;
    isLoading: boolean;
    watchlist: string[];
    onAddToWatchlist: (ticker: string) => void;
    onRemoveFromWatchlist: (ticker: string) => void;
}

export const TickerInput: React.FC<TickerInputProps> = ({ ticker, setTicker, onSubmit, isLoading, watchlist, onAddToWatchlist, onRemoveFromWatchlist }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredAssetCategories = useMemo(() => {
        if (!searchQuery) {
            return assetCategories;
        }
        return assetCategories
            .map(category => ({
                ...category,
                options: category.options.filter(
                    option =>
                        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        option.value.toLowerCase().includes(searchQuery.toLowerCase())
                ),
            }))
            .filter(category => category.options.length > 0);
    }, [searchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(ticker);
    };

    const noOptionsAvailable = filteredAssetCategories.flatMap(c => c.options).length === 0;
    const isWatched = watchlist.includes(ticker);

    return (
        <form onSubmit={handleSubmit} className="bg-[#0D1117] border border-gray-700/50 p-4 rounded-xl shadow-2xl space-y-4">
            <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-500" />
                </span>
                <input
                    type="text"
                    placeholder="Search for an asset..."
                    aria-label="Search for an asset"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#161B22] text-white border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-grow w-full">
                    <select
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        className="w-full bg-[#161B22] text-white border border-gray-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 appearance-none disabled:opacity-50"
                        disabled={isLoading || noOptionsAvailable}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.75rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.25em 1.25em',
                        }}
                    >
                        {noOptionsAvailable ? (
                            <option>No assets found</option>
                        ) : (
                            filteredAssetCategories.map(category => (
                                <optgroup key={category.label} label={category.label} className="bg-[#010409] text-gray-400 font-bold">
                                    {category.options.map(option => (
                                        <option key={option.value} value={option.value} className="bg-[#161B22] text-white font-normal">
                                            {option.label}
                                        </option>
                                    ))}
                                </optgroup>
                            ))
                        )}
                    </select>
                </div>
                 <button
                    type="button"
                    onClick={isWatched ? () => onRemoveFromWatchlist(ticker) : () => onAddToWatchlist(ticker)}
                    className={`w-full sm:w-auto bg-gray-700/50 text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D1117] focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center`}
                    disabled={isLoading || noOptionsAvailable}
                    title={isWatched ? `Remove ${ticker} from watchlist` : `Add ${ticker} to watchlist`}
                >
                    <StarIcon className={`h-5 w-5 ${isWatched ? 'text-yellow-400' : 'text-gray-400'}`} />
                </button>
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0D1117] focus:ring-blue-500 disabled:bg-blue-500/50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                    disabled={isLoading || noOptionsAvailable}
                >
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
            </div>
        </form>
    );
};