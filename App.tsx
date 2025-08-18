import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TickerInput } from './components/TickerInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { StrategyCard } from './components/StrategyCard';
import { PriceChart } from './components/PriceChart';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SourcesDisplay } from './components/SourcesDisplay';
import { HistoryPage } from './components/HistoryPage';
import { ChartBarIcon } from './components/icons';
import { getTradingStrategy } from './services/geminiService';
import type { AnalysisResult, ChartDataPoint, Source, HistoryItem } from './types';

const generateChartData = (currentPrice: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const days = 10;
    let price = currentPrice * (1 + (Math.random() - 0.5) * 0.1); // Start price is +/- 5% from end price

    for (let i = 0; i < days - 1; i++) {
        data.push({ name: `D-${days - i - 1}`, price: parseFloat(price.toFixed(2)) });
        price *= (1 + (Math.random() - 0.48) * 0.05); // +/- 2.5% daily fluctuation
    }
    data.push({ name: 'Current', price: parseFloat(currentPrice.toFixed(2)) });
    return data;
};

const App: React.FC = () => {
    const [page, setPage] = useState<'about' | 'signals' | 'history'>('about');
    const [ticker, setTicker] = useState<string>('BTCUSD');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('signalHistory');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to parse history from localStorage", e);
            setHistory([]);
        }
    }, []);

    const handleAnalyze = useCallback(async (tickerToAnalyze: string) => {
        if (!tickerToAnalyze) {
            setError('Please select an asset to analyze.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setChartData([]);
        setSources([]);

        try {
            const { analysis: result, sources: newSources } = await getTradingStrategy(tickerToAnalyze);
            setAnalysis(result);
            setSources(newSources);
            setChartData(generateChartData(result.currentPrice));
            
            const newHistoryItem: HistoryItem = {
                id: new Date().toISOString() + Math.random(),
                ticker: result.ticker,
                timestamp: new Date().toISOString(),
                currentPrice: result.currentPrice,
                sources: newSources,
                ...result.strategy,
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

    const renderAboutPage = () => (
         <div className="text-center pt-24 pb-20 text-white animate-fade-in max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center bg-gray-800/80 border border-gray-700 rounded-full px-4 py-1.5 text-sm font-medium text-gray-300 mb-6">
                <ChartBarIcon className="h-4 w-4 mr-2 text-gray-400" />
                About Us
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Discover AI Signals</h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-400">Explore our core principles, mission, vision, and team.</p>
             <div className="mt-24">
                <p className="text-sm tracking-widest uppercase text-gray-500">AS FEATURED IN</p>
                <div className="mt-8 flex justify-center items-center gap-8 md:gap-12 flex-wrap">
                    <span className="font-medium text-xl text-gray-400/80">Nasdaq</span>
                    <span className="font-medium text-xl text-gray-400/80">CoinDesk</span>
                    <span className="font-medium text-xl text-gray-400/80">Forbes</span>
                    <span className="font-medium text-xl text-gray-400/80">Medium</span>
                </div>
            </div>
        </div>
    );

    const renderSignalsPage = () => (
         <div className="max-w-5xl mx-auto">
            <TickerInput
                ticker={ticker}
                setTicker={setTicker}
                onSubmit={handleAnalyze}
                isLoading={isLoading}
            />
            
            <div className="mt-8">
                {isLoading && <LoadingSpinner />}
                {error && <ErrorDisplay message={error} />}
                {analysis && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <PriceChart data={chartData} ticker={analysis.ticker} />
                            </div>
                            <div className="lg:col-span-1">
                                <StrategyCard strategy={analysis.strategy} currentPrice={analysis.currentPrice} />
                            </div>
                        </div>
                        <AnalysisDisplay analysis={analysis} />
                        {sources.length > 0 && <SourcesDisplay sources={sources} />}
                    </div>
                )}
                 {!isLoading && !error && !analysis && (
                    <div className="text-center py-20 text-gray-600 animate-fade-in">
                        <p>Generate a signal to see the analysis results.</p>
                    </div>
                 )}
            </div>
        </div>
    );

    return (
        <div className="bg-[#0A0C12] text-gray-300 min-h-screen font-sans">
            <Header page={page} setPage={setPage} />
            <main className="container mx-auto p-4 md:p-8">
                {page === 'about' && renderAboutPage()}
                {page === 'signals' && renderSignalsPage()}
                {page === 'history' && <HistoryPage history={history} onClearHistory={handleClearHistory} />}
            </main>
        </div>
    );
};

export default App;