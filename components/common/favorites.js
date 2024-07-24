// FavoriteComponent.js

import React from 'react';
import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from '@/redux/features/authApiSlice';

const FavoriteComponent = () => {
    const { data: favorites, error, isLoading } = useGetFavoritesQuery();
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();

    const handleAddFavorite = async () => {
        const sampleName = document.getElementById('sampleName').value;
        try {
            await addFavorite(sampleName).unwrap();
        } catch (error) {
            console.error('Failed to add favorite:', error);
        }
    };

    const handleRemoveFavorite = async (sampleName) => {
        try {
            await removeFavorite(sampleName).unwrap();
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    return (
        <div>
            <h1>Favorites</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error loading favorites</p>
            ) : (
                <ul>
                    {favorites.map((sampleName, index) => (
                        <li key={index}>
                            {sampleName}
                            <button onClick={() => handleRemoveFavorite(sampleName)}>Remove</button>
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
