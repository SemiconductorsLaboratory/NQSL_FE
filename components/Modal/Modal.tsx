import React, { useEffect } from "react";
import Image from 'next/image';  // Importez le composant Image de Next.js
import './styles/Modal-module.css';

export const Modal = ({
                          isOpen,
                          onClose,
                          children
                      }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    // Effet pour désactiver le défilement du body lorsque le modal est ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Désactive le défilement
        } else {
            document.body.style.overflow = ''; // Réinitialise le défilement
        }

        // Nettoyage du style lors du démontage du composant
        return () => {
            document.body.style.overflow = ''; // Réinitialise le défilement
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div className="modal-backdrop" onClick={handleBackdropClick}>
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-header-name">
                            <p>Add Sample</p>
                        </div>
                        <Image
                            src="/cross.png"
                            alt="Close"
                            width={24}
                            height={24}
                            onClick={onClose}
                            style={{ cursor: 'pointer' }} // Ajouter un curseur pointeur
                        />
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
};