import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import '../styles/modal.css';


const FileItem = ({ url }: { url: string }) => {
    const [fileAvailable, setFileAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log(`Checking availability for: ${url}`);
        axios
            .head(url, {
                withCredentials: true,
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(`File is available: ${url}`);
                    setFileAvailable(true);
                }
            })
            .catch((err) => {
                console.error('Error checking file availability:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [url]);

    if (isLoading) return <li>Loading file...</li>;
    if (!fileAvailable) return <li>File not available</li>;


    return (
        <>
            <li style={{ marginBottom: '20px' }}>
                <div style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
                    <p>Click to view PDF</p>
                </div>
            </li>


            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="PDF Viewer"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '80%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: 'none',
                        padding: '0',
                    },
                }}
            >
            </Modal>
        </>
    );
};

export default FileItem;