import React from 'react';

interface ResizerProps {
    onResize: (newWidth: number) => void;
}

const Resizer: React.FC<ResizerProps> = ({ onResize }) => {
    const handleMouseDown = (e: React.MouseEvent) => {
        const startX = e.clientX;

        const handleMouseMove = (e: MouseEvent) => {
            const delta = e.clientX - startX;
            onResize(delta);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.classList.remove('no-select');
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.classList.add('no-select');
    };

    return <div className="resizer" onMouseDown={handleMouseDown} />;
};

export default Resizer;
