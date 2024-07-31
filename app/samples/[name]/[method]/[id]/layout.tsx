'use client';

import React, { ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useSemDetailQuery } from "@/redux/features/sampleApiSlice";

interface LayoutProps {
    children: ReactNode;
}

const LayoutId: React.FC<LayoutProps> = ({ children }) => {
    const params = useParams();
    const { id } = params as { id?: string };

    if (!id) {
        return <p>Loading...</p>;
    }

    const { data, error, isLoading } = useSemDetailQuery(id);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    console.log('Data:', data);
    console.log('Error:', error);

    if (error || !data) {
        return (
            <div>
                <p>Error loading data</p>
                {error && (
                    <pre>
                        <code>{JSON.stringify(error, null, 2)}</code>
                    </pre>
                )}
            </div>
        );
    }

    const isSem = data.method === 'sem';

    return (
        <div>
            <h1>Sample Layout for ID</h1>
            {isSem && <p>This is a SEM method</p>}
            <div>
                <p>ID: {data.id}</p>
                <p>Method: {data.method}</p>
                <p>Sample: {data.sample}</p>
                <p>Created At: {data.created_at}</p>
                <p>Description: {data.description}</p>
                <p>Magnification: {data.magnification}</p>
                <p>Voltage: {data.voltage}</p>
                <p>Current: {data.current}</p>
                <p>Image: {data.image}</p>
                <p>Files: {data.files.join(', ')}</p>
            </div>
            {children}
        </div>
    );
};

export default LayoutId;
