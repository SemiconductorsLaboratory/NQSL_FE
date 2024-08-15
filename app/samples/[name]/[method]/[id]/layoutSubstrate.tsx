'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSubstrateSampleQuery, useDetailSampleQuery } from "@/redux/features/sampleApiSlice";
import '@/styles/layoutSubstrate.css';

const SubstrateLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const params = useParams();
    const { name } = params as { name?: string };

    // Récupérer les détails du sample principal
    const { data: detailData, error: detailError, isLoading: detailLoading } = useDetailSampleQuery(name, {
        skip: !name,
    });

    const [sampleName, setSampleName] = useState<string | null>(null);

    useEffect(() => {
        if (detailData && detailData.prev_sample) {
            setSampleName(detailData.prev_sample);
        } else if (name) {
            setSampleName(null); // Si prev_sample n'est pas présent, on ne fait pas de requête pour le substrate
        }
    }, [detailData, name]);

    // Récupérer les données du substrate uniquement si sampleName est défini
    const { data: substrateData, error: substrateError, isLoading: substrateLoading } = useSubstrateSampleQuery(sampleName as string, {
        skip: !sampleName, // Skip si sampleName n'est pas défini
    });

    if (detailLoading) {
        return <p>Loading...</p>;
    }

    if (detailError) {
        return <p>Error loading sample details</p>;
    }

    if (substrateLoading) {
        return <p>Loading substrate data...</p>;
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
                {substrateData.layers.map((layer: any, layerIndex: number) => (
                    <tr key={`layer-${layerIndex}`}>
                        <td>{layer.name}</td>
                        <td>{layer.layer_thickness}</td>
                        <td>
                            {layer.layer_comp.map((comp: any, compIndex: number) => (
                                <div key={`comp-${layerIndex}-${compIndex}`}>
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
