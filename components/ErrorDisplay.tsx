
import React from 'react';

export const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{message}</span>
    </div>
);
