
import React, { useEffect, useRef } from 'react';
import * as LightweightCharts from 'lightweight-charts';
import type { CandleDataPoint, AnalysisResult } from '../types';

interface PriceChartProps {
    data: CandleDataPoint[];
    analysis: AnalysisResult;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, analysis }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    // Use a ref to hold chart state to persist them across renders
    const chartInstanceRef = useRef<{ 
        chart: LightweightCharts.IChartApi; 
        series: LightweightCharts.ISeriesApi<'Candlestick'>; 
        resizeObserver: ResizeObserver;
        priceLines: LightweightCharts.IPriceLine[];
    } | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) {
            return;
        }

        const container = chartContainerRef.current;

        // Create the chart, series, and observer only once
        if (!chartInstanceRef.current) {
            const chart = LightweightCharts.createChart(container, {
                width: container.clientWidth,
                height: container.clientHeight,
                layout: {
                    background: {
                        type: LightweightCharts.ColorType.Solid,
                        color: 'transparent',
                    },
                    textColor: '#9CA3AF',
                },
                grid: {
                    vertLines: { color: 'rgba(75, 85, 99, 0.3)' },
                    horzLines: { color: 'rgba(75, 85, 99, 0.3)' },
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    borderColor: '#4B5563',
                },
                crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: '#4B5563',
                },
            });
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#10B981',
                downColor: '#EF4444',
                borderDownColor: '#EF4444',
                borderUpColor: '#10B981',
                wickDownColor: '#EF4444',
                wickUpColor: '#10B981',
            });
            
            const resizeObserver = new ResizeObserver(() => {
                 if (container.clientWidth > 0 && container.clientHeight > 0) {
                    chart.resize(container.clientWidth, container.clientHeight);
                 }
            });
            resizeObserver.observe(container);

            chartInstanceRef.current = { chart, series: candlestickSeries, resizeObserver, priceLines: [] };
        }
        
        const { chart, series } = chartInstanceRef.current;

        // Clear previous price lines before adding new ones
        chartInstanceRef.current.priceLines.forEach(line => series.removePriceLine(line));
        chartInstanceRef.current.priceLines = []; // Reset the array
        
        // Ensure data is sorted by time before setting it
        const sortedData = [...data].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

        // Set new data and fit the view
        // FIX: lightweight-charts requires a UNIX timestamp for intraday data, not an ISO string.
        // We also filter out any malformed data points to prevent errors.
        const formattedData = sortedData
            .map(d => ({
                time: (new Date(d.time).getTime() / 1000) as LightweightCharts.UTCTimestamp,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            }))
            .filter(d => 
                d &&
                !isNaN(d.time) &&
                d.open != null && !isNaN(d.open) &&
                d.high != null && !isNaN(d.high) &&
                d.low != null && !isNaN(d.low) &&
                d.close != null && !isNaN(d.close)
            );
            
        if (formattedData.length > 0) {
            series.setData(formattedData);
            chart.timeScale().fitContent();
        } else {
            series.setData([]);
        }


        // Add new price lines with visible labels and store them
        const newPriceLines: LightweightCharts.IPriceLine[] = [];
        const { strategy } = analysis;
        
        const createPriceLine = (value: number, title: string, color: string) => {
             if (value === undefined || value === null || isNaN(value)) return;
             const priceLine = series.createPriceLine({
                price: value,
                color: color,
                lineWidth: 2,
                lineStyle: LightweightCharts.LineStyle.Dashed,
                axisLabelVisible: true,
                title: title, // This displays the label on the line
            });
            newPriceLines.push(priceLine);
        };
        
        if (strategy.signal !== 'HOLD') {
            createPriceLine(strategy.takeProfit1, 'TP1', '#22c55e');
            createPriceLine(strategy.takeProfit2, 'TP2', '#22c55e');
            createPriceLine(strategy.entryPrice, 'Entry', '#3b82f6');
            createPriceLine(strategy.stopLoss, 'SL', '#ef4444');
        } else {
            createPriceLine(analysis.currentPrice, 'Price', '#60a5fa');
        }
        
        // Update the ref with the newly created price lines
        chartInstanceRef.current.priceLines = newPriceLines;
        
    }, [data, analysis]); 

    // Cleanup effect that runs only on component unmount
    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                const { chart, resizeObserver } = chartInstanceRef.current;
                resizeObserver.disconnect();
                chart.remove();
                chartInstanceRef.current = null;
            }
        }
    }, []);

    return (
        <div className="bg-[#0D1117] border border-gray-700/50 p-4 rounded-xl shadow-2xl h-[400px] w-full">
            <div ref={chartContainerRef} className="h-full w-full" />
        </div>
    );
};
