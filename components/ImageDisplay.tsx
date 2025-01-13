// components/ImageDisplay.tsx
import React from 'react';
import Image from 'next/image';

interface ImageDisplayProps {
    url: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ url }) => {
    return (
        <div>
            <Image src={`http://localhost:8000${url}`} alt="Sample" style={{ maxWidth: '50%', height: 'auto' }} />
        </div>
    );
};

export default ImageDisplay;
