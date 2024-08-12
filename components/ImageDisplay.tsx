// components/ImageDisplay.tsx
import React from 'react';

interface ImageDisplayProps {
    url: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ url }) => {
    return (
        <div>
            <img src={`http://localhost:8000${url}`} alt="Sample" style={{ maxWidth: '50%', height: 'auto' }} />
        </div>
    );
};

export default ImageDisplay;
