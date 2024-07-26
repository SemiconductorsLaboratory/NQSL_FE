'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import "../../../styles/layoutData.css";

const SampleDataLayout: React.FC = () => {
    const params = useParams();
    const { name } = params as { name?: string };

    if (!name) {
        return <p>No name provided</p>;
    }

    return (
        <div className="sample-data">
            <p>{name}</p>
        </div>
    );
};

export default SampleDataLayout;