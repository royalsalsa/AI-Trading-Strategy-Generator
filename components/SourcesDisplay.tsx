
import React from 'react';
import type { Source } from '../types';
import { SourceIcon, LinkIcon, ExternalLinkIcon } from './icons';

interface SourcesDisplayProps {
    sources: Source[];
}

export const SourcesDisplay: React.FC<SourcesDisplayProps> = ({ sources }) => {
    return (
        <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-lg">
            <h4 className="font-bold text-blue-400 mb-4 flex items-center">
                <SourceIcon className="h-5 w-5 mr-2" />
                Strategy Data Sources
            </h4>
            <div className="space-y-3">
                {sources.map((source, index) => {
                    if (!source.web?.uri) return null;

                    let displayTitle = source.web.title;
                    let displayUri = source.web.uri;

                    try {
                        const url = new URL(source.web.uri);
                        displayUri = url.hostname.replace(/^www\./, '');
                        if (!displayTitle) {
                             displayTitle = url.hostname;
                        }
                    } catch {
                        displayTitle = displayTitle || source.web.uri;
                    }

                    return (
                        <a 
                            key={index}
                            href={source.web.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-800 transition-colors duration-200 group"
                        >
                            <div className="flex-shrink-0 mr-4">
                                <LinkIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <p className="font-semibold text-gray-100 truncate group-hover:text-white" title={displayTitle}>
                                    {displayTitle}
                                </p>
                                <p className="text-xs text-gray-400 truncate group-hover:text-gray-300" title={source.web.uri}>
                                    {displayUri}
                                </p>
                            </div>
                            <div className="flex-shrink-0 ml-4">
                                <ExternalLinkIcon className="h-4 w-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                            </div>
                        </a>
                    )
                })}
            </div>
        </div>
    );
};
