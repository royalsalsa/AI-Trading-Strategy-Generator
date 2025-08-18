import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
    page: 'about' | 'signals' | 'history';
    setPage: (page: 'about' | 'signals' | 'history') => void;
}

const NavLink: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`text-sm font-medium transition-colors duration-200 ${
            active
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
        }`}
    >
        {children}
    </button>
);


export const Header: React.FC<HeaderProps> = ({ page, setPage }) => (
    <header className="bg-transparent sticky top-0 z-20 backdrop-blur-sm bg-[#0A0C12]/80">
        <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center border-b border-gray-800/50">
            <div className="flex items-center gap-x-8">
                <LogoIcon className="h-8" />
            </div>
            <div className="flex items-center gap-x-6">
                <nav className="hidden md:flex items-center gap-x-6">
                    <NavLink active={page === 'about'} onClick={() => setPage('about')}>
                        About Us
                    </NavLink>
                    <NavLink active={page === 'signals'} onClick={() => setPage('signals')}>
                        Signals
                    </NavLink>
                    <NavLink active={page === 'history'} onClick={() => setPage('history')}>
                        History
                    </NavLink>
                </nav>
                 <nav className="flex md:hidden items-center gap-x-4">
                    <NavLink active={page === 'signals'} onClick={() => setPage('signals')}>
                        Signals
                    </NavLink>
                    <NavLink active={page === 'history'} onClick={() => setPage('history')}>
                        History
                    </NavLink>
                </nav>
                <button className="hidden sm:block bg-white/5 text-white font-medium py-2 px-4 rounded-md hover:bg-white/10 text-sm transition-colors border border-white/10">
                    Get access
                </button>
            </div>
        </div>
    </header>
);