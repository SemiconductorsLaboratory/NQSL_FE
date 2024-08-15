import React, { useState, useRef, useEffect } from 'react';
import { useGetSamplesQuery } from '@/redux/features/authApiSlice';
import axios from 'axios';
import "../../styles/Searchbar.css";
import Image from "next/image";
import ModalSampleAdd from "@/components/Modal/Modal-SampleAdd";
import { Modal } from "@/components/Modal/Modal";

const SearchbarComponent = () => {
    const { data: samples, error, isLoading } = useGetSamplesQuery();
    const [query, setQuery] = useState('');
    const [selectedSample, setSelectedSample] = useState(null);
    const [errorState, setError] = useState(null);
    const searchRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing] = useState(false);

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
            <div className="search-bar-container">
                <div className="search-bar-with-icon">
                    <Image
                        className="icon-loop"
                        src="/loop.png"
                        width={30}
                        height={30}
                        alt="search icon"
                    />
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={handleSearch}
                    />
                </div>
                <button onClick={() => setIsModalOpen(true)} disabled={isProcessing}>
                    <Image
                        className="icon-add"
                        src="/add.png"
                        width={30}
                        height={30}
                        alt="add icon"
                    />
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalSampleAdd />
            </Modal>

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
                                <a href={`/samples/${sample.name}`}
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
