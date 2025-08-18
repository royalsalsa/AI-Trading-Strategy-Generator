import React, { useState, useMemo, useEffect } from 'react';
import { SearchIcon } from './icons';

interface TickerInputProps {
    ticker: string;
    setTicker: (ticker: string) => void;
    onSubmit: (ticker: string) => void;
    isLoading: boolean;
}

const assetCategories = [
    {
        label: "Crypto",
        options: [
            { value: "BTCUSD", label: "Bitcoin (BTCUSD)" },
            { value: "ETHUSD", label: "Ethereum (ETHUSD)" },
            { value: "SOLUSD", label: "Solana (SOLUSD)" },
            { value: "XRPUSD", label: "XRP (XRPUSD)" },
            { value: "LTCUSD", label: "Litecoin (LTCUSD)" },
            { value: "BCHUSD", label: "Bitcoin Cash (BCHUSD)" },
            { value: "DOGEUSD", label: "Dogecoin (DOGEUSD)" },
            { value: "BNBUSD", label: "BNB (BNBUSD)" },
            { value: "USDTUSD", label: "Tether (USDTUSD)" },
        ],
    },
    {
        label: "Indices",
        options: [
            { value: "IXIC", label: "Nasdaq (IXIC)" },
            { value: "DJI", label: "Dow Jones (DJI)" },
            { value: "INX", label: "S&P 500 (INX)" },
            { value: "DXY", label: "U.S. Dollar Index (DXY)" },
            { value: "NDX", label: "NASDAQ 100 (NDX)" },
            { value: "HSI", label: "Hang Seng (HK50)" },
            { value: "NI225", label: "Nikkei 225 (JPN225)" },
            { value: "DAX", label: "DAX (GER40)" },
            { value: "FTSE", label: "FTSE 100 (UK100)" },
            { value: "CAC40", label: "CAC 40 (FRA40)" },
            { value: "ASX", label: "ASX 200 (AUS200)" },
            { value: "IBEX", label: "IBEX 35 (SPA35)" },
        ],
    },
    {
        label: "Forex",
        options: [
            { value: "EURUSD", label: "EUR/USD" },
            { value: "GBPUSD", label: "GBP/USD" },
            { value: "USDJPY", label: "USD/JPY" },
            { value: "USDCHF", label: "USD/CHF" },
            { value: "AUDUSD", label: "AUD/USD" },
            { value: "USDCAD", label: "USD/CAD" },
            { value: "NZDUSD", label: "NZD/USD" },
            { value: "EURJPY", label: "EUR/JPY" },
            { value: "GBPJPY", label: "GBP/JPY" },
            { value: "EURGBP", label: "EUR/GBP" },
            { value: "AUDNZD", label: "AUD/NZD" },
        ],
    },
    {
        label: "Commodities",
        options: [
            { value: "XAUUSD", label: "Gold (XAUUSD)" },
            { value: "XAGUSD", label: "Silver (XAGUSD)" },
            { value: "USOIL", label: "WTI Crude Oil (USOIL)" },
        ],
    },
];

export const TickerInput: React.FC<TickerInputProps> = ({ ticker, setTicker, onSubmit, isLoading }) => {
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

    useEffect(() => {
        const allOptions = filteredAssetCategories.flatMap(c => c.options);
        if (allOptions.length > 0) {
            const isSelectedTickerVisible = allOptions.some(o => o.value === ticker);
            if (!isSelectedTickerVisible) {
                setTicker(allOptions[0].value);
            }
        }
    }, [filteredAssetCategories, ticker, setTicker]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(ticker);
    };

    const noOptionsAvailable = filteredAssetCategories.flatMap(c => c.options).length === 0;

    return (
        <form onSubmit={handleSubmit} className="bg-[#161b22]/50 border border-gray-800 p-6 rounded-lg shadow-xl space-y-4">
            <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input
                    type="text"
                    placeholder="Search for an asset..."
                    aria-label="Search for an asset"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0d1117] text-white border border-gray-700 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
                <select
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                    className="flex-grow w-full bg-[#0d1117] text-white border border-gray-700 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200 appearance-none disabled:opacity-50"
                    disabled={isLoading || noOptionsAvailable}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                    }}
                >
                    {noOptionsAvailable ? (
                        <option>No assets found</option>
                    ) : (
                        filteredAssetCategories.map(category => (
                            <optgroup key={category.label} label={category.label} className="bg-[#010409] text-gray-400 font-bold">
                                {category.options.map(option => (
                                    <option key={option.value} value={option.value} className="bg-[#0d1117] text-white font-normal">
                                        {option.label}
                                    </option>
                                ))}
                            </optgroup>
                        ))
                    )}
                </select>
                <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-blue-400/50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                    disabled={isLoading || noOptionsAvailable}
                >
                    {isLoading ? 'Analyzing...' : 'Analyze & Generate Strategy'}
                </button>
            </div>
        </form>
    );
};