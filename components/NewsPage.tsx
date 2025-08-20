
import React, { useState, useEffect } from 'react';
import { getFinancialNews } from '../services/geminiService';
import type { NewsArticle } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { ExternalLinkIcon, NewspaperIcon } from './icons';

// Same helper function from HistoryPage
const formatRelativeTime = (isoDate: string): string => {
    const now = new Date();
    const date = new Date(isoDate);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    
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

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    let sourceHost = article.sourceName;
    try {
        sourceHost = new URL(article.sourceUrl).hostname.replace('www.', '');
    } catch (e) {
        // keep original source name if URL is invalid
    }

    return (
        <a 
            href={article.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-[#161B22] border border-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:-translate-y-1"
        >
            <div className="flex justify-between items-center text-sm mb-3">
                <span className="font-semibold text-blue-400">{article.sourceName}</span>
                <span className="text-gray-400">{formatRelativeTime(article.publishedDate)}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300">{article.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{article.summary}</p>
            <div className="flex items-center text-xs text-gray-500 mt-4">
                <ExternalLinkIcon className="h-4 w-4 mr-2" />
                <span>{sourceHost}</span>
            </div>
        </a>
    );
};

export const NewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const newsData = await getFinancialNews();
                // Sort by date descending
                newsData.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
                setArticles(newsData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred while fetching news.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }

        if (error) {
            return <div className="max-w-4xl mx-auto"><ErrorDisplay message={error} /></div>;
        }

        if (articles.length === 0) {
            return (
                <div className="text-center py-16 text-gray-500">
                    <h2 className="text-2xl font-semibold">No News Found</h2>
                    <p className="mt-2">Could not fetch the latest news at this time. Please try again later.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                    <NewsCard key={`${article.sourceUrl}-${index}`} article={article} />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="text-center mb-10">
                <div className="flex justify-center items-center gap-4">
                     <NewspaperIcon className="h-10 w-10 text-blue-400" />
                     <h1 className="text-4xl md:text-5xl font-bold text-white">Latest Financial News</h1>
                </div>
                <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
                    AI-curated global market updates, powered by Google Search.
                </p>
            </div>
            {renderContent()}
        </div>
    );
};