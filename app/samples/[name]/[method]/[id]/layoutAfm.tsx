import React from 'react';

const AfmLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <h1>AFM Layout</h1>
            {children}
        </div>
    );
};

export default AfmLayout;