import React, { useState, useEffect } from 'react';
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '@/redux/features/authApiSlice';
import "../../styles/Favorites.css";
import Image from "next/image";

const FavoriteComponent = () => {
    const { data: favorites, error, isLoading, refetch } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [localFavorites, setLocalFavorites] = useState([]);

    useEffect(() => {
        if (favorites) {
            setLocalFavorites(favorites);
        }
    }, [favorites]);

    const handleAddFavorite = async () => {
        const sampleName = document.getElementById('sampleName').value;
        try {
            await addFavorite(sampleName).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to add favorite:', error);
        }
    };

    const handleRemoveFavorite = async (sampleName) => {
        try {
            await removeFavorite(sampleName).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    return (
        <div className={"container-favorite"}>
            <h1 className={"favorite-title"}>Favorites</h1>
            <div className={"line"}></div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading favorites</p>
            ) : (
                <ul>
                    {localFavorites.map((sampleName, index) => (
                        <li key={index} className={"sample-favorite"}>
                            {sampleName}
                            <button onClick={() => handleRemoveFavorite(sampleName)}>
                                <Image src={"/cross.png"}
                                       alt={"cross"}
                                       width={20}
                                       height={20}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div>
                <input type="text" placeholder="Sample Name" id="sampleName" />
                <button onClick={handleAddFavorite}>Add Favorite</button>
            </div>
        </div>
    );
};

export default FavoriteComponent;