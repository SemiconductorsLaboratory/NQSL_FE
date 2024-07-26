'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@/redux/features/authApiSlice";
import "../../../styles/layoutName.css";
import Image from "next/image";

const SampleNameLayout: React.FC = () => {
    // @ts-ignore
    const { data: favorites, error, isLoading, refetch } = useGetFavoritesQuery();
    const params = useParams();
    const { name } = params as { name?: string }; // Make name optional
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (name && favorites) {
            const favoriteNames = new Set(favorites as string[]);
            setIsFavorite(favoriteNames.has(name));
        }
    }, [favorites, name]);

    const handleAddFavorite = async () => {
        setIsProcessing(true);
        try {
            await addFavorite(name).unwrap();
            setIsFavorite(true);
            refetch();
        } catch (error) {
            console.error('Failed to add favorite:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveFavorite = async () => {
        setIsProcessing(true);
        try {
            await removeFavorite(name).unwrap();
            setIsFavorite(false);
            refetch();
        } catch (error) {
            console.error('Failed to remove favorite:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!name || isLoading || error) {
        return null;
    }

    return (
        <div className="sample-type">
            <h1 className="name">{name}</h1>
            <div className="button-favorite">
                {isFavorite ? (
                    <button onClick={handleRemoveFavorite} disabled={isProcessing}>
                        <Image
                            src="/trash.png"
                            width={25}
                            height={25}
                            alt="trash favorite"
                        />
                    </button>
                ) : (
                    <button onClick={handleAddFavorite} disabled={isProcessing}>
                        <Image
                            src="/etoile.png"
                            width={50}
                            height={50}
                            alt="etoile favorite"
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SampleNameLayout;