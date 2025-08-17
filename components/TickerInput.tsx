import React from 'react';

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
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(ticker);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col sm:flex-row items-center gap-4">
            <select
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="flex-grow w-full bg-gray-700 text-white border border-gray-600 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 appearance-none"
                disabled={isLoading}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                }}
            >
                {assetCategories.map(category => (
                    <optgroup key={category.label} label={category.label} className="bg-gray-900 text-gray-400 font-bold">
                        {category.options.map(option => (
                            <option key={option.value} value={option.value} className="bg-gray-700 text-white font-normal">
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
            <button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
                disabled={isLoading}
            >
                {isLoading ? 'Analyzing...' : 'Analyze & Generate Strategy'}
            </button>
        </form>
    );
};