import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult, Source } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("API_KEY environment variable not set. Please set it in your environment.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getTradingStrategy = async (ticker: string): Promise<{ analysis: AnalysisResult, sources: Source[] }> => {
    if (!API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const prompt = `
        Act as a quantitative financial analyst using real, up-to-date data from Google Search. For the financial instrument with the symbol '${ticker.toUpperCase()}', provide a technical analysis.

        Your response MUST be a single, valid JSON object that adheres to the following structure. Do not include any other text, explanations, or markdown formatting before or after the JSON object.

        The JSON structure must be:
        {
          "ticker": "string",
          "currentPrice": number,
          "pivotPoints": { "s3": number, "s2": number, "s1": number, "pp": number, "r1": number, "r2": number, "r3": number },
          "rsi": { "value": number, "interpretation": "'Overbought' | 'Oversold' | 'Neutral'" },
          "movingAverages": { "ma50": number, "ma200": number },
          "strategy": {
            "signal": "'BUY' | 'SELL' | 'HOLD'",
            "description": "string",
            "entryPrice": number,
            "stopLoss": number,
            "takeProfit": number
          }
        }

        Provide the following information based on the latest available market data:
        1.  The latest known market price for the asset.
        2.  Standard Pivot Points (S3, S2, S1, PP, R1, R2, R3) calculated from the previous trading day's High, Low, and Close.
        3.  The current 14-period Relative Strength Index (RSI) value and its interpretation.
        4.  The current values for the 50-day and 200-day simple moving averages (SMA).
        5.  A clear, actionable trading strategy ('BUY', 'SELL', or 'HOLD') based *only* on the indicators you've generated.
        6.  A concise, one-sentence description justifying the strategy.
        7.  Suggested price levels for the strategy:
            - "entryPrice": A reasonable entry point based on the current price and strategy. For a BUY, this might be slightly above the current price. For a SELL, slightly below.
            - "stopLoss": A protective stop-loss level. For a BUY, this should be below a key support level (e.g., S1). For a SELL, it should be above a key resistance level (e.g., R1).
            - "takeProfit": A target price to take profits. For a BUY, this should be below a key resistance level (e.g., R1 or R2). For a SELL, it should be above a key support level (e.g., S1 or S2).
            - If the signal is 'HOLD', set "entryPrice", "stopLoss", and "takeProfit" to 0.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.2, // Lower temperature for more factual JSON output
            },
        });

        const jsonText = response.text.trim();
        // The model can sometimes wrap the JSON in markdown, so we extract it.
        const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
        const extractedJson = jsonMatch ? jsonMatch[1] : jsonText;
        
        const analysis: AnalysisResult = JSON.parse(extractedJson);
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        
        const sources: Source[] = (groundingMetadata?.groundingChunks ?? []).reduce<Source[]>((acc, chunk) => {
            if (chunk.web?.uri) {
                acc.push({
                    web: {
                        uri: chunk.web.uri,
                        title: chunk.web.title
                    }
                });
            }
            return acc;
        }, []);

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