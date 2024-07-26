import React, { useState, useRef, useEffect } from 'react';
import { useGetSamplesQuery } from '@/redux/features/authApiSlice';
import axios from 'axios';
import "../../styles/Searchbar.css"



const SearchbarComponent = () => {
    const { data: samples, error, isLoading } = useGetSamplesQuery();
    const [query, setQuery] = useState('');
    const [selectedSample, setSelectedSample] = useState(null);
    const [errorState, setError] = useState(null);
    const searchRef = useRef(null);

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const handleSampleClick = async (sample) => {
        try {
            const response = await axios.get(`http://192.168.2.23:8000/api/samples/${sample.name}`);
            console.log('Sample details fetched from API:', response.data);
            setSelectedSample(response.data);
        } catch (err) {
            console.error('Error fetching sample details:', err);
            setError('Error fetching sample details');
        }
    };

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setQuery('');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredSamples = samples?.filter((sample) =>
        sample.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="container-searchbar" ref={searchRef}>
            <input
                className="search-bar"
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleSearch}
            />
            {isLoading ? (
                <p></p>
            ) : error ? (
                <p>Error loading samples</p>
            ) : (
                query && (
                    <ul className="sample-list">
                        {filteredSamples.map((sample) => (
                            <li
                                key={sample.name}
                                onClick={() => handleSampleClick(sample)}
                            >
                                <a href={`/samples/${(sample.name)}`}
                                   className="sample-list-item">
                                    {sample.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
};

export default SearchbarComponent;