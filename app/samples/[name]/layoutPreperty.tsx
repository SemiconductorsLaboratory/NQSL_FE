'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFetchSampleModelByNameQuery } from '@/redux/features/sampleApiSlice';
import "../../../styles/layoutProperty.css";

const SampleDataLayout: React.FC = () => {
    const params = useParams();
    const { name } = params as { name?: string };
    const { data, error, isLoading } = useFetchSampleModelByNameQuery(name, {
        skip: !name,
    });

    if (!name) {
        return <p>No name provided</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data</p>;
    }

    return (
        <div className={"container-property"}>
            <h1 className={"property-title"}>Property</h1>
            <div className={"line"}></div>
            {data ? (
                <div>
                    <p>description : {data.description}</p>
                    <p>date : {data.date}</p>
                    <p className={"user"}>{data.user}</p>
                </div>
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default SampleDataLayout;