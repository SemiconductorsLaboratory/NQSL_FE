import React, { useState, useEffect } from 'react';
import { useGetFavoritesQuery, useRemoveFavoriteMutation } from '@/redux/features/authApiSlice';
import Link from 'next/link';
import "../../styles/Favorites.css";
import Image from "next/image";

const FavoriteComponent: React.FC = () => {
    // @ts-ignore
    const { data: favorites, error, isLoading, refetch } = useGetFavoritesQuery();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [localFavorites, setLocalFavorites] = useState<string[]>([]);

    useEffect(() => {
        if (favorites) {
            setLocalFavorites(favorites as string[]);
        }
    }, [favorites]);

    const handleRemoveFavorite = async (sampleName: string) => {
        try {
            await removeFavorite(sampleName).unwrap();
            refetch();
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        }
    };

    return (
        <div className="container-favorite">
            <h1 className="favorite-title">Favorites</h1>
            <div className="line"></div>
            {isLoading ? (
                <p></p>
            ) : error ? (
                <p>Error loading favorites</p>
            ) : (
                <ul>
                    {localFavorites.map((sampleName, index) => (
                        <li key={index} className="sample-favorite">
                            <div className="sample-type">
                                <Link href={`/samples/${sampleName}`} passHref>
                                    {sampleName}
                                </Link>
                            </div>
                            <button onClick={() => handleRemoveFavorite(sampleName)}>
                                <Image
                                    src="/trash.png"
                                    alt="trash"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoriteComponent;