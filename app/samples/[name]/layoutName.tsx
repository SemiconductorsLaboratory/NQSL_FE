'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAddFavoriteMutation, useGetFavoritesQuery, useRemoveFavoriteMutation } from "@/redux/features/authApiSlice";
import "../../../styles/layoutName.css";
import Image from "next/image";
import ModalSampleModification from "@/components/Modal/Modal-SampleModification";
import {Modal} from "@/components/Modal/Modal";

const SampleNameLayout: React.FC = () => {
    // @ts-ignore
    const { data: favorites, error, isLoading, refetch } = useGetFavoritesQuery();
    const params = useParams();
    const { name } = params as { name?: string }; // Make name optional
    const [addFavorite] = useAddFavoriteMutation();
    const [removeFavorite] = useRemoveFavoriteMutation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

            <button onClick={() => setIsModalOpen(true)} disabled={isProcessing}>
                <Image
                    src="/pen.png"
                    width={35}
                    height={35}
                    alt="pen"
                />
            </button>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalSampleModification/>
            </Modal>

            <button>
                <Image
                    src="/trash.png"
                    width={35}
                    height={35}
                    alt="trash"
                />
            </button>

            <div className="button-favorite">
                {isFavorite ? (
                    <button onClick={handleRemoveFavorite} disabled={isProcessing}>
                        <Image
                            src="/bookmark-filled.png"
                            width={35}
                            height={35}
                            alt="bookmark filled"
                        />
                    </button>
                ) : (
                    <button onClick={handleAddFavorite} disabled={isProcessing}>
                        <Image
                            src="/bookmark.png"
                            width={35}
                            height={35}
                            alt="bookmark"
                        />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SampleNameLayout;