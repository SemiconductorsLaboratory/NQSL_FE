// src/components/FetchSampleModel.js

import React, { useState } from 'react';
import { useFetchSampleModelByNameQuery } from '@/redux/features/sampleApiSlice';

const FetchSampleModel = () => {
    const [name, setName] = useState('');
    const { data, error, isLoading } = useFetchSampleModelByNameQuery(name, {
        skip: !name,
    });

    const handleFetch = () => {
        // Trigger a re-fetch if needed
    };

    return (
        <div>
            <h1>Fetch SampleModel by Name</h1>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleFetch}>Fetch</button>
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && (
                <div>
                    <h2>{data.name}</h2>
                    <p>{data.description}</p>
                    <p>{data.date_created}</p>
                    <p>{data.user}</p>
                    <p>{data.substrate}</p>
                    <p>{data.prev_user}</p>
                    {/* Render other fields as needed */}
                </div>
            )}
        </div>
    );
};

export default FetchSampleModel;