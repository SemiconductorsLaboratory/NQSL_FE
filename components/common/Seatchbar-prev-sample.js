import React, { useState, useRef, useEffect } from 'react';
import { useGetSamplesQuery } from '@/redux/features/authApiSlice';
import Image from 'next/image';
import '../../styles/Searchbar-prevSample.css';

const SearchbarComponentPrevSample = ({ onSelect }) => {
    const { data: samples, error, isLoading } = useGetSamplesQuery();
    const [query, setQuery] = useState('');
    const [selectedSample, setSelectedSample] = useState(null);
    const [isListVisible, setIsListVisible] = useState(false); // État pour gérer la visibilité de la liste
    const searchRef = useRef(null);

    const handleSearch = (e) => {
        setQuery(e.target.value);
        setIsListVisible(true); // Affiche la liste lorsque l'utilisateur tape dans la barre de recherche
    };

    const handleSampleClick = (sample) => {
        setQuery(sample.name);
        setSelectedSample(sample);
        setIsListVisible(false); // Masque la liste après la sélection
        onSelect(sample); // Appel du callback avec l'échantillon sélectionné
    };

    const handleClickOutsideSearchbar = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsListVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideSearchbar);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSearchbar);
        };
    }, []);

    const filteredSamples = samples?.filter((sample) =>
        sample.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="container-searchbarPrevSample" ref={searchRef}>
            <div className="search-bar-containerPrevSample">
                <div className="search-bar-with-iconPrevSample">
                    <Image
                        className="icon-loopPrevSample"
                        src="/loop.png"
                        width={30}
                        height={30}
                        alt="search icon"
                    />
                    <input
                        className="search-barPrevSample"
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading samples</p>
            ) : (
                isListVisible && filteredSamples && filteredSamples.length > 0 && (
                    <ul className="sample-listPrevSample">
                        {filteredSamples.map((sample) => (
                            <li
                                key={sample.name}
                                onClick={() => handleSampleClick(sample)}
                            >
                                <span className="sample-list-itemPrevSample">
                                    {sample.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
};

export default SearchbarComponentPrevSample;
