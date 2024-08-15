import React from "react";
import './styles/Modal-module.css';

export const Modal = ({
                          isOpen,
                          onClose,
                          children
                      } : {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div className="modal-backdrop"
                 onClick={handleBackdropClick}
            >
                <div className="modal-content">
                    {children}
                    <button className="button-close"
                            onClick={onClose}
                    >Close</button>
                </div>
            </div>
        </>
    );
};
