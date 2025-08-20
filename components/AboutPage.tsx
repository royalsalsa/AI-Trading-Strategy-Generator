

import React from 'react';
import { BrainIcon, BarChartIcon, TargetIcon, GlobeIcon } from './icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-[#161B22] p-6 rounded-lg border border-gray-800 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
        <div className="flex items-center gap-4 mb-3">
            <div className="bg-blue-600/20 p-2 rounded-md">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-400 leading-relaxed">
            {children}
        </p>
    </div>
);

interface DataSource {
    name: string;
    url: string;
}

const dataSources: DataSource[] = [
    { name: 'Actionforex.com', url: 'https://www.actionforex.com' },
    { name: 'Ainvest.com', url: 'https://www.ainvest.com' },
    { name: 'Altindex.com', url: 'https://altindex.com' },
    { name: 'Arabictrader.com', url: 'https://www.arabictrader.com' },
    { name: 'AXA-IM.co.uk', url: 'https://www.axa-im.co.uk' },
    { name: 'BankOfEngland.co.uk', url: 'https://www.bankofengland.co.uk' },
    { name: 'Barchart.com', url: 'https://www.barchart.com' },
    { name: 'BEA.gov', url: 'https://www.bea.gov' },
    { name: 'Binance.com', url: 'https://www.binance.com' },
    { name: 'Bitbo.io', url: 'https://bitbo.io' },
    { name: 'Blockonomi', url: 'https://blockonomi.com' },
    { name: 'Blockworks.co', url: 'https://blockworks.co' },
    { name: 'BNA.bh', url: 'https://www.bna.bh' },
    { name: 'Businesstoday.com.my', url: 'https://www.businesstoday.com.my' },
    { name: 'Chinadailyasia.com', url: 'https://www.chinadailyasia.com' },
    { name: 'Coinbase.com', url: 'https://www.coinbase.com' },
    { name: 'Coincodex.com', url: 'https://coincodex.com' },
    { name: 'Coingecko.com', url: 'https://www.coingecko.com' },
    { name: 'Coinmarketcap.com', url: 'https://coinmarketcap.com' },
    { name: 'Commbank.com.au', url: 'https://www.commbank.com.au' },
    { name: 'Crypto.news', url: 'https://crypto.news' },
    { name: 'Cryptodnes.bg', url: 'https://cryptodnes.bg' },
    { name: 'Dailyforex.com', url: 'https://www.dailyforex.com' },
    { name: 'Dbs.com.hk', url: 'https://www.dbs.com.hk' },
    { name: 'Deutschewealth.com', url: 'https://www.deutschewealth.com' },
    { name: 'Discoveryalert.com.au', url: 'https://www.discoveryalert.com.au' },
    { name: 'Economic Times', url: 'https://economictimes.indiatimes.com' },
    { name: 'Efginternational.com', url: 'https://www.efginternational.com' },
    { name: 'Europa.eu', url: 'https://europa.eu' },
    { name: 'Financefeeds.com', url: 'https://financefeeds.com' },
    { name: 'FlyEptPortugal.com', url: 'https://www.flyeptportugal.com' },
    { name: 'Forex.com', url: 'https://www.forex.com' },
    { name: 'Fortrade.com', url: 'https://www.fortrade.com' },
    { name: 'Fxempire.com', url: 'https://www.fxempire.com' },
    { name: 'FXLeaders.com', url: 'https://www.fxleaders.com' },
    { name: 'FXStreet.com', url: 'https://www.fxstreet.com' },
    { name: 'Fxview.com', url: 'https://www.fxview.com' },
    { name: 'Gainesvillecoins.com', url: 'https://www.gainesvillecoins.com' },
    { name: 'GlobalBankingAndFinance.com', url: 'https://www.globalbankingandfinance.com' },
    { name: 'Gold.org', url: 'https://www.gold.org' },
    { name: 'Growbeansprout.com', url: 'https://growbeansprout.com' },
    { name: 'Hkeconomy.gov.hk', url: 'https://www.hkeconomy.gov.hk' },
    { name: 'Holder.io', url: 'https://holder.io' },
    { name: 'Investing.com', url: 'https://www.investing.com' },
    { name: 'Investtech.com', url: 'https://www.investtech.com' },
    { name: 'Investx.com', url: 'https://investx.com' },
    { name: 'Jpmorgan.com', url: 'https://www.jpmorgan.com' },
    { name: 'Kagels-trading.com', url: 'https://kagels-trading.com' },
    { name: 'Kraken.com', url: 'https://www.kraken.com' },
    { name: 'Kucoin.com', url: 'https://www.kucoin.com' },
    { name: 'Litefinance.org', url: 'https://www.litefinance.org' },
    { name: 'Livemint.com', url: 'https://www.livemint.com' },
    { name: 'Marketpulse.com', url: 'https://www.marketpulse.com' },
    { name: 'Marketscreener.com', url: 'https://www.marketscreener.com' },
    { name: 'Mitrade.com', url: 'https://www.mitrade.com' },
    { name: 'Nasdaq.com', url: 'https://www.nasdaq.com' },
    { name: 'Noortrends.ae', url: 'https://noortrends.ae' },
    { name: 'Nordea.com', url: 'https://www.nordea.com' },
    { name: 'Oanda.com', url: 'https://www.oanda.com' },
    { name: 'ONS.gov.uk', url: 'https://www.ons.gov.uk' },
    { name: 'Oppenheimer', url: 'https://www.oppenheimer.com' },
    { name: 'Parliament.uk', url: 'https://www.parliament.uk' },
    { name: 'RBA.gov.au', url: 'https://www.rba.gov.au' },
    { name: 'Saxo Bank', url: 'https://www.home.saxo' },
    { name: 'Scmp.com', url: 'https://www.scmp.com' },
    { name: 'Seeking Alpha', url: 'https://seekingalpha.com' },
    { name: 'SEIC.com', url: 'https://www.seic.com' },
    { name: 'Serrarigroup.com', url: 'https://www.serrarigroup.com' },
    { name: 'Sky.com', url: 'https://www.sky.com' },
    { name: 'Spglobal.com', url: 'https://www.spglobal.com' },
    { name: 'Ssga.com', url: 'https://www.ssga.com' },
    { name: 'Thearmchairtrader.com', url: 'https://www.thearmchairtrader.com' },
    { name: 'Theblock.co', url: 'https://www.theblock.co' },
    { name: 'Thecurrencyanalytics.com', url: 'https://thecurrencyanalytics.com' },
    { name: 'TipRanks.com', url: 'https://www.tipranks.com' },
    { name: 'Tradestation.com', url: 'https://www.tradestation.com' },
    { name: 'TradingEconomics.com', url: 'https://www.tradingeconomics.com' },
    { name: 'Tradingview.com', url: 'https://www.tradingview.com' },
    { name: 'Usgoldbureau.com', url: 'https://www.usgoldbureau.com' },
    { name: 'Vanguard.com', url: 'https://www.vanguard.com' }
];

const TeamMemberCard: React.FC<{ name: string; title: string; imageUrl: string; children: React.ReactNode }> = ({ name, title, imageUrl, children }) => (
     <div className="bg-[#161B22] p-6 rounded-lg border border-gray-800 text-center">
        <img src={imageUrl} alt={`Photo of ${name}`} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-700 object-cover" />
        <h4 className="text-xl font-bold text-white">{name}</h4>
        <p className="text-blue-400 font-medium mb-3">{title}</p>
        <p className="text-sm text-gray-400">{children}</p>
    </div>
);

export const AboutPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto animate-fade-in text-gray-300">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white">About AI Signal Generator</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-400">
                    This application harnesses the power of Google's Gemini AI to provide sophisticated, real-time trading analysis and actionable strategies for a variety of financial assets.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                <FeatureCard icon={<BrainIcon className="h-6 w-6 text-blue-400" />} title="Advanced AI Analysis">
                    Leverages the Gemini 2.5 Flash model to interpret complex market data, identify patterns, and generate nuanced trading strategies that go beyond simple indicators.
                </FeatureCard>
                <FeatureCard icon={<GlobeIcon className="h-6 w-6 text-blue-400" />} title="Real-Time Data">
                    Integrates with Google Search to ground its analysis in the latest market news and price action, ensuring strategies are timely and relevant to current conditions.
                </FeatureCard>
                 <FeatureCard icon={<BarChartIcon className="h-6 w-6 text-blue-400" />} title="Comprehensive Insights">
                    Provides a full suite of technical indicators, including Pivot Points, RSI, and Moving Averages, giving you a holistic view of the asset's technical posture.
                </FeatureCard>
                <FeatureCard icon={<TargetIcon className="h-6 w-6 text-blue-400" />} title="Actionable Signals">
                    Delivers clear BUY, SELL, or HOLD signals complete with suggested entry prices, stop-loss levels, and take-profit targets to inform your trading decisions.
                </FeatureCard>
            </div>

            <div className="mb-16">
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Meet the Team</h2>
                <p className="max-w-3xl mx-auto text-lg text-gray-400 mb-10 text-center">
                    We are a passionate team of developers, data scientists, and financial experts dedicated to revolutionizing the trading landscape.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <TeamMemberCard name="Osama Salsa" title="Founder & CEO" imageUrl="https://randomuser.me/api/portraits/men/75.jpg">
                        A former quantitative analyst with a vision to make institutional-grade tools accessible to everyone.
                    </TeamMemberCard>
                    <TeamMemberCard name="Maria Garcia" title="Lead AI Engineer" imageUrl="https://randomuser.me/api/portraits/women/76.jpg">
                        The architect behind our predictive models, with a Ph.D. in machine learning and a passion for financial markets.
                    </TeamMemberCard>
                    <TeamMemberCard name="David Chen" title="Head of Product" imageUrl="https://randomuser.me/api/portraits/men/78.jpg">
                        Ensures our platform is intuitive, powerful, and constantly evolving to meet the needs of our users.
                    </TeamMemberCard>
                    <TeamMemberCard name="Sophia Lee" title="Market Analyst" imageUrl="https://randomuser.me/api/portraits/women/79.jpg">
                        Bridges the gap between AI insights and real-world trading strategies, providing expert commentary.
                    </TeamMemberCard>
                </div>
            </div>
            
            <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold text-white mb-6">Technology Stack</h2>
                 <div className="flex justify-center items-center gap-x-8 flex-wrap">
                     <span className="font-semibold text-gray-400">Google Gemini</span>
                     <span className="font-semibold text-gray-400">React</span>
                     <span className="font-semibold text-gray-400">Tailwind CSS</span>
                     <span className="font-semibold text-gray-400">Lightweight Charts</span>
                 </div>
            </div>

            <div className="bg-[#161B22] p-8 rounded-lg border border-gray-800 mb-12">
                <h2 className="text-3xl font-bold text-white mb-3 text-center">Data Sources</h2>
                 <p className="text-center text-gray-400 max-w-3xl mx-auto mb-8">
                    Our AI Signal Generator is powered by real-time data from a wide array of reputable financial news and data providers to ensure our analysis is comprehensive and up-to-date.
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
                    {dataSources.map((source) => (
                        <a 
                            key={source.name} 
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-gray-400 hover:text-blue-400 hover:underline transition-colors duration-200"
                        >
                            {source.name}
                        </a>
                    ))}
                </div>
            </div>

            <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-lg text-center">
                 <h3 className="text-xl font-bold text-red-300 mb-2">Disclaimer</h3>
                 <p className="text-red-300/90 text-sm">
                    The information and strategies provided by this application are for educational and informational purposes only. They do not constitute financial, investment, or trading advice. All trading involves risk, and you should not risk more than you are prepared to lose. Past performance is not indicative of future results. Always conduct your own research and consult with a qualified financial advisor before making any investment decisions.
                 </p>
            </div>
        </div>
    );
};