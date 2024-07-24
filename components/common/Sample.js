// SampleComponent.js

import React from 'react';
import { useGetSamplesQuery, useAddSampleMutation, useDeleteSampleMutation } from '@/redux/features/authApiSlice';

const SampleComponent = () => {
    const { data: samples, error, isLoading } = useGetSamplesQuery();
    const [addSample] = useAddSampleMutation();
    const [deleteSample] = useDeleteSampleMutation();

    const handleAddSample = async () => {
        const sampleData = {
            name: document.getElementById('sampleName').value,
            description: document.getElementById('sampleDescription').value,
            user_id: document.getElementById('sampleUser').value,
            substrate: document.getElementById('sampleSubstrate').value,
            prev_sample: document.getElementById('prevSample').value,
        };
        try {
            await addSample(sampleData).unwrap();
        } catch (error) {
            console.error('Failed to add sample:', error);
        }
    };

    const handleDeleteSample = async () => {
        const sampleName = document.getElementById('sampleToDelete').value;
        try {
            await deleteSample(sampleName).unwrap();
        } catch (error) {
            console.error('Failed to delete sample:', error);
        }
    };

    return (
        <div>
            <h1>Samples</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading samples</p>
            ) : (
                <ul>
                    {samples.map((sample) => (
                        <li key={sample.name}>
                            {sample.name}
                            <button onClick={() => handleDeleteSample(sample.name)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
            <div>
                <input type="text" placeholder="Sample Name" id="sampleName" />
                <input type="text" placeholder="Sample Description" id="sampleDescription" />
                <input type="text" placeholder="User ID" id="sampleUser" />
                <input type="text" placeholder="Substrate" id="sampleSubstrate" />
                <input type="text" placeholder="Previous Sample ID" id="prevSample" />
                <button onClick={handleAddSample}>Add Sample</button>
            </div>
            <div>
                <input type="text" placeholder="Sample Name to Delete" id="sampleToDelete" />
                <button onClick={handleDeleteSample}>Delete Sample</button>
            </div>
        </div>
    );
};

export default SampleComponent;
