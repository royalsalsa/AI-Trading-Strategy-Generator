
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult, Source, NewsArticle } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const DATA_SOURCES_LIST = `
Actionforex.com, Ainvest.com, Altindex.com, Arabictrader.com, AXA-IM.co.uk, BankOfEngland.co.uk, Barchart.com, BEA.gov, Binance.com, Bitbo.io, Blockonomi, Blockworks.co, BNA.bh, Businesstoday.com.my, Chinadailyasia.com, Coinbase.com, Coincodex.com, Coingecko.com, Coinmarketcap.com, Commbank.com.au, Crypto.news, Cryptodnes.bg, Dailyforex.com, Dbs.com.hk, Deutschewealth.com, Discoveryalert.com.au, Economic Times, Efginternational.com, Europa.eu, Financefeeds.com, FlyEptPortugal.com, Forex.com, Fortrade.com, Fxempire.com, FXLeaders.com, FXStreet.com, Fxview.com, Gainesvillecoins.com, GlobalBankingAndFinance.com, Gold.org, Growbeansprout.com, Hkeconomy.gov.hk, Holder.io, Investing.com, Investtech.com, Investx.com, Jpmorgan.com, Kagels-trading.com, Kraken.com, Kucoin.com, Litefinance.org, Livemint.com, Marketpulse.com, Marketscreener.com, Mitrade.com, Nasdaq.com, Noortrends.ae, Nordea.com, Oanda.com, ONS.gov.uk, Oppenheimer, Parliament.uk, RBA.gov.au, Saxo Bank, Scmp.com, Seeking Alpha, SEIC.com, Serrarigroup.com, Sky.com, Spglobal.com, Ssga.com, Thearmchairtrader.com, Theblock.co, Thecurrencyanalytics.com, TipRanks.com, Tradestation.com, TradingEconomics.com, Tradingview.com, Usgoldbureau.com, Vanguard.com
`;

export const getTradingStrategy = async (ticker: string): Promise<{ analysis: AnalysisResult, sources: Source[] }> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const prompt = `
        Act as a senior quantitative financial analyst. Your primary tool is Google Search. For the financial instrument with the symbol '${ticker.toUpperCase()}', you must provide a technical analysis, market sentiment summary, and a detailed narrative strategy.

        **CRITICAL INSTRUCTIONS:**
        1.  **Data Recency:** All information, news, and data points used in your analysis MUST be from the last 12 hours. Do not use older information.
        2.  **Prioritized Sources:** You MUST prioritize sourcing your information from the following list of reputable financial websites. Use these as your primary sources for analysis, sentiment, and news. If a significant event is not covered by these, you may use other major news outlets, but preference must always be given to this list: ${DATA_SOURCES_LIST}.
        3.  **JSON Output Only:** Your response MUST be a single, valid JSON object that adheres to the specified structure. Do not include any other text, explanations, or markdown formatting before or after the JSON object.
        4.  **Verifiable Citations:** Within the "analysisDescription" and "riskTip" fields, you MUST add inline citations in the format [1], [2], etc., immediately following any specific numerical data, statistics, prices, percentages, or key factual claims derived from your search. This is essential for verifiability.

        The JSON structure must be:
        {
          "ticker": "string",
          "currentPrice": number,
          "pivotPoints": { "s3": number, "s2": number, "s1": number, "pp": number, "r1": number, "r2": number, "r3": number },
          "rsi": { "value": number, "interpretation": "'Overbought' | 'Oversold' | 'Neutral'" },
          "movingAverages": { "ma50": number, "ma200": number },
          "strategy": {
            "signal": "'BUY' | 'SELL' | 'HOLD'",
            "description": "A concise, one-sentence summary of the trading signal and its primary justification.",
            "entryPrice": number,
            "stopLoss": number,
            "takeProfit1": number,
            "takeProfit2": number,
            "confidence": number, // A score from 0 to 100 representing the confidence in this signal.
            "analysisDescription": "A detailed, multi-paragraph analysis of the asset's current market position based on data from the last 12 hours. Combine technical, fundamental, and geopolitical factors. Discuss recent price action, key drivers, and relevant news. Identify key technical support and resistance levels. The tone should be professional and analytical.",
            "riskTip": "A concise, actionable paragraph outlining the primary risks associated with trading this asset in the current environment, based on data from the last 12 hours. Mention upcoming events that could cause volatility. Provide practical risk management advice.",
            "newsSummary": "A concise, one-paragraph summary of recent news (last 12 hours) influencing the asset's price and sentiment, separate from the main analysis."
          },
          "marketSentiment": "'Bullish' | 'Bearish' | 'Neutral'",
          "historicalData": [
            { "time": "YYYY-MM-DDTHH:mm:ssZ", "open": number, "high": number, "low": number, "close": number }
          ]
        }
        
        Provide the last 5 days of historical data at a 1-hour timeframe.

        --- EXAMPLE OF HIGH-QUALITY STRATEGY NARRATIVE ---
        For "analysisDescription": "Gold (XAU/USD) is currently navigating a complex landscape... The immediate bearish pressure stems primarily from a strengthening US Dollar (DXY), which has surged to its highest level in over a week, trading around the 98.30-98.40 mark[1]. From a fundamental standpoint, market participants are heavily focused on the Federal Reserve's monetary policy, with an overwhelming probability (83-86%)[2] of a 25-basis-point rate cut anticipated in September 2025. While lower interest rates are generally supportive of gold, recent US economic data, particularly the hotter-than-expected July Producer Price Index (PPI)[3], has introduced some uncertainty... Technically, gold has recently seen a rejection from its 50-day Moving Average on the two-hour chart[4]. The 14-period Relative Strength Index (RSI) remains above the neutral 50 level... Key support levels are identified around $3314, $3307[5], and most notably $3300 and $3290, while resistance is seen at $3331, $3350, and $3361[5,6]."
        For "riskTip": "Trading Gold (XAU/USD) in the current volatile environment necessitates robust risk management... Given that a large percentage of retail traders are currently net-long on gold[7], a contrarian perspective suggests the market could be prone to a sharp correction if sentiment shifts. Therefore, strict adherence to predefined stop-loss levels and appropriate position sizing are paramount to mitigate potential losses."
        --- END OF EXAMPLE ---

        Now, generate the full JSON object for '${ticker.toUpperCase()}' based on real, up-to-date data from the last 12 hours, following all rules and matching the style of the example provided. For the "signal" and associated prices ("entryPrice", "stopLoss", "takeProfit1", "takeProfit2"), if the analysis suggests holding, set "entryPrice", "stopLoss", "takeProfit1", and "takeProfit2" to the current price.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.3,
            },
        });
        
        if (!response?.text) {
             throw new Error("The AI returned an empty or invalid response. This could be due to a content safety block or an issue with the model. Please try a different asset or try again later.");
        }

        const jsonText = response.text.trim();
        // The model can sometimes wrap the JSON in markdown, so we extract it.
        const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
        const extractedJson = jsonMatch ? jsonMatch[1] : jsonText;
        
        const analysis: AnalysisResult = JSON.parse(extractedJson);
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        
        const sources: Source[] = (groundingMetadata?.groundingChunks ?? []).reduce((acc, chunk) => {
            if (chunk.web?.uri) {
                acc.push({
                    web: {
                        uri: chunk.web.uri,
                        title: chunk.web.title
                    }
                });
            }
            return acc;
        }, [] as Source[]);

        return { analysis, sources };

    } catch (error) {
        console.error("Error generating trading strategy:", error);
        if (error instanceof SyntaxError) {
             throw new Error(`Failed to parse AI response as JSON. Please try again.`);
        }
        if (error instanceof Error) {
            throw new Error(`Failed to get analysis from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
};

export const getFinancialNews = async (): Promise<NewsArticle[]> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const prompt = `
        Act as a financial news editor. Using Google Search, find the top 15 most significant global financial news articles from the last 12 hours. Focus on news related to major indices (S&P 500, Nasdaq), forex (EUR/USD, USD/JPY), commodities (Gold, Oil), and cryptocurrencies (Bitcoin, Ethereum).
        
        You MUST prioritize sourcing your news from the following reputable financial websites. If a significant event is not covered by these, you may use other major news outlets, but preference should always be given to this list: ${DATA_SOURCES_LIST}.

        Your response MUST be a single, valid JSON object that is an array of news articles. Do not include any other text, explanations, or markdown formatting before or after the JSON object.

        Each article object in the JSON array must adhere to the following structure:
        {
          "title": "string // The full, original headline of the article.",
          "summary": "string // A concise, one or two-sentence summary of the article's key points.",
          "sourceName": "string // The name of the publication (e.g., 'Investing.com', 'Reuters').",
          "sourceUrl": "string // The full, direct URL to the original article.",
          "publishedDate": "string // The publication date and time in ISO 8601 format (e.g., '2023-10-27T10:00:00Z')."
        }

        Ensure the URLs are valid and the summaries are neutral and informative.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.1, // Low temperature for factual news aggregation
            },
        });

        if (!response?.text) {
            throw new Error("The AI returned an empty or invalid response while fetching news. Please try again later.");
        }

        const jsonText = response.text.trim();
        const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
        const extractedJson = jsonMatch ? jsonMatch[1] : jsonText;

        const newsArticles: NewsArticle[] = JSON.parse(extractedJson);
        return newsArticles;

    } catch (error) {
        console.error("Error fetching financial news:", error);
        if (error instanceof SyntaxError) {
             throw new Error(`Failed to parse AI response for news as JSON. Please try again.`);
        }
        if (error instanceof Error) {
            throw new Error(`Failed to get news from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching news from the AI.");
    }
};
