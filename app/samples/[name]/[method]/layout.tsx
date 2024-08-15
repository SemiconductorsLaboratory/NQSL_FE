'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import LayoutAfm from './[id]/layoutAfm';
import LayoutSem from './[id]/layoutSem';
import LayoutSubstrate from './[id]/layoutSubstrate';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const params = useParams();
    const method = params.method as string;

    if (!method) return <div>Invalid URL structure</div>;

    const renderLayout = () => {
        switch (method) {
            case 'afm':
                return <LayoutAfm>{children}</LayoutAfm>;
            case 'sem':
                return <LayoutSem>{children}</LayoutSem>;
            case 'substrate':
                return <LayoutSubstrate>{children}</LayoutSubstrate>;
            default:
                return <div>Unknown method</div>;
        }
    };

    return (
        <div>
            {renderLayout()}
        </div>
    );
};

export default Layout;