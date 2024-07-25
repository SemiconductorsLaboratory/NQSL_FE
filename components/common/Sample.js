import React, { useState } from 'react';
import { useGetSamplesQuery, useAddSampleMutation, useDeleteSampleMutation } from '@/redux/features/authApiSlice';

const SampleComponent = () => {
    const { data: samples, error, isLoading } = useGetSamplesQuery();
    const [addSample] = useAddSampleMutation();
    const [deleteSample] = useDeleteSampleMutation();

    const [newSample, setNewSample] = useState({
        name: '',
        description: '',
        user: '', // Adjust according to your user handling logic
        substrate: '',
        prev_sample: '',
    });

    const [sampleToDelete, setSampleToDelete] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSample((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSample = async () => {
        try {
            await addSample(newSample).unwrap();
            setNewSample({
                name: '',
                description: '',
                user: '',
                substrate: '',
                prev_sample: '',
            });
        } catch (error) {
            console.error('Failed to add sample: ', error);
        }
    };

    const handleDeleteSample = async () => {
        try {
            await deleteSample(sampleToDelete).unwrap();
            setSampleToDelete('');
        } catch (error) {
            console.error('Failed to delete sample: ', error);
        }
    };

    return (
        <div>
            <h1>Samples</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading samples</p>}
            {samples && (
                <ul>
                    {samples.map((sample) => (
                        <li key={sample.id}>
                            {sample.name}
                        </li>
                    ))}
                </ul>
            )}

            <div>
                <input
                    type="text"
                    name="name"
                    value={newSample.name}
                    onChange={handleInputChange}
                    placeholder="Sample Name"
                />
                <input
                    type="text"
                    name="description"
                    value={newSample.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                />
                <input
                    type="text"
                    name="User"
                    value={newSample.user}
                    onChange={handleInputChange}
                    placeholder="User"
                />
                {/* Add other input fields for user, substrate, prev_sample as needed */}
                <button onClick={handleAddSample}>Add Sample</button>
            </div>

            <div>
                <input
                    type="text"
                    value={sampleToDelete}
                    onChange={(e) => setSampleToDelete(e.target.value)}
                    placeholder="Sample Name to Delete"
                />
                <button onClick={handleDeleteSample}>Delete Sample</button>
            </div>
        </div>
    );
};

export default SampleComponent;