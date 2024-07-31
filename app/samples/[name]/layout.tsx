'use client';

import React, { ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import "../../../styles/layoutData.css";
import { useDetailSampleQuery } from "@/redux/features/sampleApiSlice";

interface LayoutProps {
    children: ReactNode;
}

const SampleDataLayout: React.FC<LayoutProps> = ({ children }) => {
    const params = useParams();
    const { name } = params as { name?: string };
    const { data, error, isLoading } = useDetailSampleQuery(name, {
        skip: !name,
    });

    const router = useRouter();

    if (!name) {
        return <p>No name provided</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data</p>;
    }

    const combinedData = [
        ...data.sem.map((item: any) => ({ ...item, method: 'sem', id: item.id })),
        ...data.afm.map((item: any) => ({ ...item, method: 'afm', id: item.id })),
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const handleClick = (method: string, id: string) => {
        router.push(`/samples/${name}/${method}/${id}`);
    };

    return (
        <div className={"container-data"}>
            <div className="sample-data">
                <div className="substrate">
                    <p>Substrate</p>
                    <p>{data.substrate.created_at}</p>
                    <p>Layer</p>
                    <ul>
                        {data.substrate.layer.map((layer: any, index: number) => (
                            <li key={index}>{layer}</li>
                        ))}
                    </ul>
                </div>

                {combinedData.map((item: any, index: number) => (
                    <div
                        key={index}
                        className="method-block"
                        onClick={() => handleClick(item.method, item.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <h3>{item.method.toUpperCase()}</h3>
                        <p>Created At: {item.created_at}</p>
                        <p>Description: {item.description}</p>
                    </div>
                ))}
            </div>
            <div className="sample-methode">
                {children}
            </div>
        </div>
    );
};

export default SampleDataLayout;