
import React from 'react';
import type { Source } from '../types';

interface SourcesDisplayProps {
    sources: Source[];
}

export const SourcesDisplay: React.FC<SourcesDisplayProps> = ({ sources }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-indigo-400 mb-4">Data Sources</h4>
            <ul className="space-y-2 list-disc list-inside">
                {sources.map((source, index) => {
                    if (!source.web) return null;
                    
                    let displayTitle = source.web.title;
                    try {
                        if (!displayTitle) {
                             displayTitle = new URL(source.web.uri).hostname;
                        }
                    } catch {
                        displayTitle = source.web.uri;
                    }


                    return (
                        <li key={index} className="text-sm text-gray-300 truncate">
                            <a 
                                href={source.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors duration-200"
                                title={source.web.title || source.web.uri}
                            >
                                {displayTitle}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};
