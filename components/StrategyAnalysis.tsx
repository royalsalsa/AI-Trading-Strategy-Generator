

import React from 'react';
import type { Source } from '../types';

interface StrategyAnalysisProps {
  strategy: {
    analysisDescription: string;
    riskTip: string;
  };
  sources: Source[];
}

const Citation: React.FC<{ citation: string; sources: Source[] }> = ({ citation, sources }) => {
    // API citations are 1-based, so convert to 0-based array indices.
    const indices = citation
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(s => parseInt(s.trim(), 10) - 1)
        .filter(n => !isNaN(n) && n >= 0 && n < sources.length);
    
    const relevantSources = indices.map(i => sources[i]);

    if (relevantSources.length === 0) {
        // If no valid source is found (e.g., out of bounds), render as plain text.
        return <sup className="text-gray-500">{citation}</sup>;
    }

    // Determine if this citation points to a single, valid URL
    const isSingleValidLink = relevantSources.length === 1 && relevantSources[0].web?.uri;

    const citationContent = (
        <span className="text-blue-400 font-bold cursor-pointer hover:underline">
            {citation}
        </span>
    );

    return (
        <sup className="relative group mx-0.5">
            {isSingleValidLink ? (
                <a 
                    href={relevantSources[0].web!.uri!} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`Source ${citation}`}
                >
                    {citationContent}
                </a>
            ) : (
                citationContent
            )}
            
            {/* Tooltip for hover, works for both single and multiple sources */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-[#0d1117] border border-gray-700 rounded-lg shadow-2xl p-3 z-10 hidden group-hover:block transition-opacity duration-300 text-left opacity-0 group-hover:opacity-100">
                <h5 className="text-sm font-bold text-gray-200 mb-2 border-b border-gray-700 pb-1">Data Sources</h5>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                    {relevantSources.map((source, index) => {
                         let displayTitle = source.web?.title;
                         try {
                             if (!displayTitle && source.web?.uri) {
                                 displayTitle = new URL(source.web.uri).hostname.replace(/^www\./, '');
                             }
                         } catch {
                             displayTitle = source.web?.uri;
                         }
                        return (
                            <li key={index} className="text-xs">
                                <a
                                    href={source.web?.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-blue-300 flex items-start gap-2 group/link"
                                    title={source.web?.title || source.web?.uri}
                                >
                                   <span className="font-bold flex-shrink-0">{indices[index] + 1}.</span>
                                   <span className="truncate block">{displayTitle || 'Unknown source'}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></div>
            </div>
        </sup>
    );
};

const renderWithCitations = (text: string, sources: Source[]) => {
    if (!sources || sources.length === 0) {
        return text.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
        ));
    }

    const citationRegex = /(\[\d+(?:,\s*\d+)*\])/;

    return text.split('\n').filter(p => p.trim() !== '').map((paragraph, pIndex) => {
        const parts = paragraph.split(citationRegex);
        return (
            <p key={pIndex}>
                {parts.map((part, partIndex) => {
                    if (/^\[\d+(?:,\s*\d+)*\]$/.test(part)) {
                        return <Citation key={partIndex} citation={part} sources={sources} />;
                    }
                    return <React.Fragment key={partIndex}>{part}</React.Fragment>;
                })}
            </p>
        );
    });
};


export const StrategyAnalysis: React.FC<StrategyAnalysisProps> = ({ strategy, sources }) => {
  if (!strategy || !strategy.analysisDescription) {
    return null;
  }

  return (
    <div className="bg-[#161b22] border border-gray-800 p-6 rounded-lg shadow-lg space-y-8">
      <div>
        <h4 className="font-bold text-lg text-blue-400 mb-3">Strategy Analysis Description</h4>
        <div className="text-gray-300 leading-relaxed space-y-4">
          {renderWithCitations(strategy.analysisDescription, sources)}
        </div>
      </div>

      {strategy.riskTip && (
        <div>
            <h4 className="font-bold text-lg text-red-400 mb-3">Risk Tip</h4>
            <div className="text-gray-300 leading-relaxed space-y-4">
            {renderWithCitations(strategy.riskTip, sources)}
            </div>
        </div>
      )}

      <div className="text-center pt-6 border-t border-gray-700/50">
          <p className="font-semibold text-gray-200">Ai Signals Intelligent Risk Control Center</p>
          <p className="text-xs text-gray-500 mt-1">Global intelligent trading ecosystem, help you rationally deal with every fluctuation in the market!</p>
      </div>

      <div className="text-xs text-gray-600 text-center pt-4">
        <p className="font-bold">Disclaimer:</p>
        <p>All content provided in this app is for learning and reference purposes only and does not constitute any investment advice or trading guidelines. Users should make their own judgement and bear the risks arising from the use of the content.</p>
      </div>
    </div>
  );
};