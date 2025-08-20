
import React, { useState, useMemo } from 'react';
import { assetCategories } from '../services/assets';
import { SearchIcon, StarIcon } from './icons';

interface WatchlistPageProps {
    watchlist: string[];
    onAdd: (ticker: string) => void;
    onRemove: (ticker: string) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({ watchlist, onAdd, onRemove }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const allAssets = useMemo(() => assetCategories.flatMap(category => category.options), []);
    const watchlistSet = useMemo(() => new Set(watchlist), [watchlist]);

    const filteredAssets = useMemo(() => {
        if (!searchQuery) {
            return allAssets;
        }
        return allAssets.filter(
            asset =>
                asset.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                asset.value.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allAssets]);

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white">Manage Watchlist</h1>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
                    Add or remove assets to quickly access them from the generator page.
                </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Available Assets Column */}
                <div className="bg-[#0D1117] border border-gray-700/50 p-6 rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-semibold text-white mb-4">Available Assets</h2>
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-500" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#161B22] text-white border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {filteredAssets.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredAssets.map(asset => {
                                    const isWatched = watchlistSet.has(asset.value);
                                    return (
                                        <li key={asset.value} className="flex items-center justify-between bg-[#161B22] p-3 rounded-lg">
                                            <div>
                                                <p className="font-medium text-white">{asset.label}</p>
                                                <p className="text-sm text-gray-400">{asset.value}</p>
                                            </div>
                                            <button
                                                onClick={isWatched ? () => onRemove(asset.value) : () => onAdd(asset.value)}
                                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                                                title={isWatched ? `Remove ${asset.label} from watchlist` : `Add ${asset.label} to watchlist`}
                                            >
                                                <StarIcon className={`h-5 w-5 ${isWatched ? 'text-yellow-400' : 'text-gray-400'}`} />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No assets found for "{searchQuery}".</p>
                        )}
                    </div>
                </div>

                {/* Your Watchlist Column */}
                 <div className="bg-[#0D1117] border border-gray-700/50 p-6 rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-semibold text-white mb-4">Your Watchlist ({watchlist.length})</h2>
                     <div className="max-h-[60vh] overflow-y-auto pr-2">
                        {watchlist.length > 0 ? (
                            <ul className="space-y-2">
                                {watchlist.map(ticker => {
                                    const assetInfo = allAssets.find(a => a.value === ticker);
                                    return (
                                         <li key={ticker} className="flex items-center justify-between bg-[#161B22] p-3 rounded-lg">
                                            <div>
                                                <p className="font-medium text-white">{assetInfo?.label || ticker}</p>
                                                <p className="text-sm text-gray-400">{ticker}</p>
                                            </div>
                                            <button
                                                onClick={() => onRemove(ticker)}
                                                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                                                aria-label={`Remove ${ticker} from watchlist`}
                                            >
                                                <StarIcon className="h-5 w-5 text-yellow-400" />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                             <div className="text-center text-gray-500 py-8">
                                <p>Your watchlist is empty.</p>
                                <p className="mt-1 text-sm">Add assets from the list on the left.</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};