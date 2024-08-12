'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useSubstrateSampleQuery } from "@/redux/features/sampleApiSlice";
import '@/styles/layoutSubstrate.css'

const SubstrateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const params = useParams();
    const { name } = params as { name?: string };
    const { data: substrateData, error: substrateError, isLoading: substrateLoading } = useSubstrateSampleQuery(name, {
        skip: !name,
    });

    if (substrateLoading) {
        return <p>Loading...</p>;
    }

    if (substrateError) {
        return <p>Error loading substrate data</p>;
    }

    if (!substrateData) {
        return <p>No substrate data available</p>;
    }

    return (
        <div>
            <div className="title-substrate">
                <p className="title">Company: {substrateData.Company}</p>
                <p className="date-substrate">{substrateData.date}</p>
            </div>
            <table className="substrate-table">
                <thead>
                <tr>
                    <th>Layer Name</th>
                    <th>Layer Thickness (µm)</th>
                    <th>Layer Composition</th>
                    <th>Doped</th>
                    <th>Doped Percentage</th>
                </tr>
                </thead>
                <tbody>
                {substrateData.layers.map((layer: any) => (
                    <tr key={layer.id_layer_thickness}>
                        <td>{layer.name}</td>
                        <td>{layer.layer_thickness}</td>
                        <td>
                            {layer.layer_comp.map((comp: any) => (
                                <div key={comp.id}>
                                    {comp.element} {comp.percentage}%
                                </div>
                            ))}
                        </td>
                        <td>{layer.doped ? 'Yes' : 'No'}</td>
                        <td>{layer.doped ? layer.doped_percentage : 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {children}
        </div>
    );
};

export default SubstrateLayout;