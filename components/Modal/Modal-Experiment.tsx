'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSEMAddMutation } from '@/redux/features/sampleApiSlice';
import { useGetSamplesQuery } from "@/redux/features/authApiSlice";

const ModalExperiment: React.FC = () => {
    const { name: sampleName } = useParams(); // Assuming 'name' is the sample name in the URL
    // @ts-ignore
    const { data: samples, refetch: refetchSamples } = useGetSamplesQuery(); // Fetch samples data
    const [sampleId, setSampleId] = useState<number | null>(null);
    const [description, setDescription] = useState<string>('');
    const [magnification, setMagnification] = useState<string>('');
    const [voltage, setVoltage] = useState<string>('');
    const [current, setCurrent] = useState<string>('');
    const [files, setFiles] = useState<File[]>([]); // Handle multiple file input

    const [SEMAdd] = useSEMAddMutation();

    // Find sample ID based on sample name
    useEffect(() => {
        if (samples) {
            const sample = samples.find((s: { name: string }) => s.name === sampleName);
            if (sample) {
                setSampleId(sample.id);
            }
        }
    }, [samples, sampleName]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!sampleId) {
            alert('Sample ID not found.');
            return;
        }

        const semData = {
            method: "SEM",
            created_at: new Date().toISOString(), // Current date-time in ISO format
            image: null, // Assuming image upload is handled separately
            description,
            magnification: Number(magnification),
            voltage: Number(voltage),
            current: Number(current),
            sample: sampleId,
            file: files, // Send array of files
        };

        try {
            const response = await SEMAdd(semData).unwrap();
            alert('SEM data added successfully!');
            refetchSamples(); // Refresh samples list
            setDescription('');
            setMagnification('');
            setVoltage('');
            setCurrent('');
            setFiles([]);
        } catch (error: any) {
            console.error('Failed to add SEM data', error);
            if (error.data) {
                console.error('Error details:', error.data);
            }
            alert('Failed to add SEM data. Please check your inputs and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div>
                <label>Magnification:</label>
                <input
                    type="number"
                    value={magnification}
                    onChange={(e) => setMagnification(e.target.value)}
                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} // Allow only numbers
                />
            </div>
            <div>
                <label>Voltage:</label>
                <input
                    type="number"
                    value={voltage}
                    onChange={(e) => setVoltage(e.target.value)}
                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} // Allow only numbers
                />
            </div>
            <div>
                <label>Current:</label>
                <input
                    type="number"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} // Allow only numbers
                />
            </div>
            {/* Add file input for multiple files */}
            <div>
                <label>File:</label>
                <input
                    type="file"
                    multiple // Allow multiple file uploads
                    onChange={(e) => setFiles(Array.from(e.target.files || []))} // Store files as array
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default ModalExperiment;