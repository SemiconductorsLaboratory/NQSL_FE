'use client';

import React, { useState, useEffect } from 'react';
import "./styles/Modal-Experiment.css";
import { useMethodListQuery, useSEMAddMutation, useDetailSampleQuery } from "@/redux/features/sampleApiSlice";
import { useParams } from 'next/navigation';

interface SEMInfo {
    method: string;
    created_at: string;
    image: string | null;
    description: string;
    magnification: number;
    voltage: number;
    current: number;
    sample: number;
    file: string[];
}

const ModalExperiment: React.FC = () => {
    const params = useParams();
    const sampleName = params?.name;
    const { data: sampleDetail, isLoading: isSampleLoading, isError: isSampleError } = useDetailSampleQuery(sampleName || '');
    const sampleId = sampleDetail?.sample_id;
    // @ts-ignore
    const { data: methods, isLoading, isError } = useMethodListQuery();
    const [addSEM, { isLoading: isSubmitting, isError: isSubmitError, isSuccess }] = useSEMAddMutation();

    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [semInfo, setSEMInfo] = useState<SEMInfo>({
        method: 'SEM',
        created_at: new Date().toISOString(),
        image: null,
        description: '',
        magnification: 0,
        voltage: 0,
        current: 0,
        sample: 0,
        file: [],
    });

    useEffect(() => {
        if (sampleId) {
            setSEMInfo((prev) => ({
                ...prev,
                sample: sampleId,
            }));
        }
    }, [sampleId]);

    const handleSubmit = async () => {
        if (!semInfo.sample || semInfo.sample === 0) {
            console.error("Invalid Sample ID:", semInfo.sample);
            alert("Invalid Sample ID. Please select a valid sample.");
            return;
        }

        console.log("Submitting SEM Info:", semInfo);
        try {
            await addSEM(semInfo).unwrap();
            alert('SEM info added successfully!');
        } catch (error) {
            console.error('Failed to add SEM info:', error);
            alert('Error submitting SEM info. Please try again.');
        }
    };

    const handleMethodClick = (method: string) => {
        setSelectedMethod(method);
        setSEMInfo((prev) => ({
            ...prev,
            method: method.toUpperCase(),
        }));
    };

    if (isLoading || isSampleLoading) {
        return <div>Loading...</div>;
    }

    if (isError || isSampleError) {
        console.error("Error fetching methods or sample details.");
        return (
            <div>
                <p>Error fetching methods or sample details.</p>
                {isError && <p>Failed to fetch methods.</p>}
                {isSampleError && <p>Failed to fetch sample details.</p>}
            </div>
        );
    }

    return (
        <div className={"container-experiment"}>
            <div className={"experiment"}>
                {methods?.map((method: string) => (
                    <div key={method}>
                        <div
                            className={"method-border method-block"}
                            onClick={() => handleMethodClick(method)}
                        >
                            {method}
                        </div>
                    </div>
                ))}
            </div>

            <div className={"header-experiment"}>
                {selectedMethod && <h1>{selectedMethod.toUpperCase()}</h1>}
            </div>

            {selectedMethod === 'sem' && (
                <div className={"input-experiment"}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                        <p>Description</p>
                        <input
                            type="text"
                            placeholder="Description"
                            value={semInfo.description}
                            onChange={(e) => setSEMInfo({...semInfo, description: e.target.value})}
                        />
                        <p>Magnification</p>
                        <input
                            type="number"
                            placeholder="Magnification"
                            value={semInfo.magnification}
                            onChange={(e) => setSEMInfo({...semInfo, magnification: Number(e.target.value)})}
                        />
                        <p>Voltage</p>
                        <input
                            type="number"
                            placeholder="Voltage"
                            value={semInfo.voltage}
                            onChange={(e) => setSEMInfo({...semInfo, voltage: Number(e.target.value)})}
                        />
                        <p>Current</p>
                        <input
                            type="number"
                            placeholder="Current"
                            value={semInfo.current}
                            onChange={(e) => setSEMInfo({...semInfo, current: Number(e.target.value)})}
                        />
                        <button type="submit" disabled={isSubmitting}>Submit SEM Info</button>
                    </form>
                    {isSubmitError && <p>Error submitting SEM info. Please try again.</p>}
                    {isSuccess && <p>SEM info submitted successfully!</p>}
                </div>
            )}
        </div>
    );
};

export default ModalExperiment;