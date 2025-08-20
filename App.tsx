
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TickerInput } from './components/TickerInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { HistoryPage } from './components/HistoryPage';
import { StrategyAnalysis } from './components/StrategyAnalysis';
import { getTradingStrategy } from './services/geminiService';
import type { AnalysisResult, Source, HistoryItem } from './types';
import { Welcome } from './components/Welcome';
import { PriceChart } from './components/PriceChart';
import { StrategyCard } from './components/StrategyCard';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { SourcesDisplay } from './components/SourcesDisplay';
import { Watchlist } from './components/Watchlist';
import { WatchlistPage } from './components/WatchlistPage';
import { AboutPage } from './components/AboutPage';
import { NewsPage } from './components/NewsPage';

type Page = 'generator' | 'history' | 'news' | 'watchlist' | 'about';

const DEFAULT_WATCHLIST = ['XAUUSD', 'BTCUSD', 'EURUSD', 'DJI'];

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('generator');
    const [ticker, setTicker] = useState<string>('BTCUSD');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [sources, setSources] = useState<Source[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [watchlist, setWatchlist] = useState<string[]>([]);

    useEffect(() => {
        // Load history from localStorage
        try {
            const storedHistory = localStorage.getItem('signalHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
            setHistory([]);
        }
        
        // Load watchlist from localStorage
        try {
            const storedWatchlist = localStorage.getItem('signalWatchlist');
            if (storedWatchlist) {
                setWatchlist(JSON.parse(storedWatchlist));
            } else {
                setWatchlist(DEFAULT_WATCHLIST);
            }
        } catch (e) {
            console.error("Failed to parse watchlist from localStorage", e);
            setWatchlist(DEFAULT_WATCHLIST);
        }
    }, []);
    
    const updateWatchlist = (newWatchlist: string[]) => {
        // Prevent duplicates and maintain order
        const uniqueWatchlist = [...new Set(newWatchlist)];
        setWatchlist(uniqueWatchlist);
        try {
            localStorage.setItem('signalWatchlist', JSON.stringify(uniqueWatchlist));
        } catch (e) {
            console.error("Failed to save watchlist to localStorage", e);
        }
    };
    
    const handleAddToWatchlist = useCallback((tickerToAdd: string) => {
        if (!watchlist.includes(tickerToAdd)) {
            const newWatchlist = [tickerToAdd, ...watchlist];
            updateWatchlist(newWatchlist);
        }
    }, [watchlist]);

    const handleRemoveFromWatchlist = useCallback((tickerToRemove: string) => {
        const newWatchlist = watchlist.filter(item => item !== tickerToRemove);
        updateWatchlist(newWatchlist);
    }, [watchlist]);

    const handleAnalyze = useCallback(async (tickerToAnalyze: string) => {
        if (!tickerToAnalyze) {
            setError('Please select an asset to analyze.');
            return;
        }
        
        setPage('generator'); // Switch to generator page if analyzing from another page
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setSources([]);

        try {
            const { analysis: result, sources: newSources } = await getTradingStrategy(tickerToAnalyze);
            setAnalysis(result);
            setSources(newSources);
            
            const newHistoryItem: HistoryItem = {
                id: new Date().toISOString() + Math.random(),
                ticker: result.ticker,
                timestamp: new Date().toISOString(),
                currentPrice: result.currentPrice,
                analysisDescription: result.strategy.analysisDescription,
                riskTip: result.strategy.riskTip,
                sources: newSources,
                marketSentiment: result.marketSentiment,
                newsSummary: result.newsSummary,
            };
            
            setHistory(prevHistory => {
                const updatedHistory = [newHistoryItem, ...prevHistory];
                try {
                    localStorage.setItem('signalHistory', JSON.stringify(updatedHistory));
                } catch (e) {
                    console.error("Failed to save history to localStorage", e);
                }
                return updatedHistory;
            });

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleClearHistory = useCallback(() => {
        if (window.confirm('Are you sure you want to clear the entire signal history? This action cannot be undone.')) {
            setHistory([]);
            try {
                localStorage.removeItem('signalHistory');
            } catch (e) {
                 console.error("Failed to clear history from localStorage", e);
            }
        }
    }, []);

    const renderGeneratorPage = () => (
         <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-8">AI Signal Generator</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
                Select an asset and click 'Generate' to get a real-time, AI-powered trading strategy.
            </p>
            <div className="mt-8 max-w-4xl mx-auto">
                 <Watchlist
                    items={watchlist}
                    onSelect={setTicker}
                    onRemove={handleRemoveFromWatchlist}
                    isLoading={isLoading}
                />
                <TickerInput
                    ticker={ticker}
                    setTicker={setTicker}
                    onSubmit={handleAnalyze}
                    isLoading={isLoading}
                    watchlist={watchlist}
                    onAddToWatchlist={handleAddToWatchlist}
                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                />
            </div>
            
            <div className="mt-8">
                {isLoading && <LoadingSpinner />}
                {error && <div className="max-w-4xl mx-auto"><ErrorDisplay message={error} /></div>}
                {!isLoading && !analysis && <Welcome />}
                {analysis && (
                    <div className="space-y-8 animate-fade-in text-left">
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                {analysis.historicalData && analysis.historicalData.length > 0 ? (
                                    <PriceChart data={analysis.historicalData} analysis={analysis} />
                                ) : (
                                    <div className="bg-[#0D1117] border border-gray-700/50 p-4 rounded-xl shadow-2xl h-[400px] w-full flex items-center justify-center">
                                        <p className="text-gray-500">No historical data available for chart.</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <StrategyCard strategy={analysis.strategy} currentPrice={analysis.currentPrice} sources={sources} />
                            </div>
                        </div>
                        <AnalysisDisplay analysis={analysis} />
                        <StrategyAnalysis strategy={analysis.strategy} sources={sources} />
                        {sources.length > 0 && <SourcesDisplay sources={sources} />}
                    </div>
                )}
            </div>
        </div>
    );
    
    return (
        <div className="bg-[#10141F] text-gray-300 min-h-screen font-sans bg-radial-gradient">
            <Header page={page} setPage={setPage} />
            <main className="container mx-auto p-4 md:p-8">
                {page === 'generator' && renderGeneratorPage()}
                {page === 'history' && <HistoryPage history={history} onClearHistory={handleClearHistory} />}
                {page === 'news' && <NewsPage />}
                {page === 'watchlist' && <WatchlistPage watchlist={watchlist} onAdd={handleAddToWatchlist} onRemove={handleRemoveFromWatchlist} />}
                {page === 'about' && <AboutPage />}
            </main>
        </div>
    );
};

export default App;
