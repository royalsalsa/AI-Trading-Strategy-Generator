import React from 'react';
import { LogoIcon } from './icons';

type Page = 'generator' | 'history' | 'news' | 'watchlist' | 'about';

interface HeaderProps {
    page: Page;
    setPage: (page: Page) => void;
}

const navItems: { id: Page, label: string }[] = [
    { id: 'generator', label: 'AI Generator' },
    { id: 'history', label: 'History' },
    { id: 'news', label: 'News' },
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'about', label: 'About' },
];

const NavLink: React.FC<{
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-md ${
            active
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
        }`}
    >
        {children}
    </button>
);


export const Header: React.FC<HeaderProps> = ({ page, setPage }) => (
    <header className="sticky top-0 z-20 backdrop-blur-sm bg-[#10141F]/80 border-b border-gray-800/60">
        <div className="container mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-x-3">
                <LogoIcon className="h-8" />
                <h1 className="text-white font-semibold text-xl hidden sm:block">AI Signals</h1>
            </div>
            <nav className="hidden md:flex items-center gap-x-2">
                 {navItems.map(item => (
                    <NavLink key={item.id} active={page === item.id} onClick={() => setPage(item.id)}>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </div>
    </header>
);