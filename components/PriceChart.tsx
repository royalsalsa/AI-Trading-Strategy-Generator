import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ChartDataPoint } from '../types';

interface PriceChartProps {
    data: ChartDataPoint[];
    ticker: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, ticker }) => {
    if (!data || data.length === 0) return null;

    const lastPrice = data[data.length - 1].price;
    const firstPrice = data[0].price;
    const strokeColor = lastPrice >= firstPrice ? '#22c55e' : '#ef4444'; // green or red

    return (
        <div className="bg-[#161b22] border border-gray-800 p-4 rounded-lg shadow-lg h-80 w-full">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">{ticker} Price Action (Illustrative)</h3>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                    <XAxis dataKey="name" stroke="#8b949e" tick={{ fontSize: 12 }} />
                    <YAxis 
                        stroke="#8b949e" 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                        tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0d1117',
                            borderColor: '#30363d'
                        }}
                        labelStyle={{ color: '#c9d1d9' }}
                    />
                    <Legend wrapperStyle={{ color: '#c9d1d9' }}/>
                    <Line type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} dot={false} name="Price" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};