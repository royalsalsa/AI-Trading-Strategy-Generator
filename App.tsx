
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TickerInput } from './components/TickerInput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { StrategyCard } from './components/StrategyCard';
import { PriceChart } from './components/PriceChart';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SourcesDisplay } from './components/SourcesDisplay';
import { WelcomeGraphic } from './components/WelcomeGraphic';
import { getTradingStrategy } from './services/geminiService';
import type { AnalysisResult, ChartDataPoint, Source } from './types';

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
    const [ticker, setTicker] = useState<string>('BTCUSD');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [sources, setSources] = useState<Source[]>([]);

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

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
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
                            <div className="text-center py-16 text-gray-500 animate-fade-in">
                                <h2 className="text-2xl font-semibold">Welcome to AI Strategy Generator</h2>
                                <p className="mt-2">Select an asset from the dropdown to get a real-time, AI-powered trading strategy.</p>
                                <WelcomeGraphic />
                            </div>
                         )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;