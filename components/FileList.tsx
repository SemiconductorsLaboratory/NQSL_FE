// components/FileList.tsx
import React, { useMemo } from 'react';
import FileItem from './FileItem';

interface FileListProps {
    files: string[];
}

const FileList: React.FC<FileListProps> = ({ files }) => {
    const memoizedFiles = useMemo(() => files, [files]);

    return (
        <div className={"pdf-container"}>
            <h2>Files</h2>
            <ul>
                {memoizedFiles.map((file, index) => (
                    <FileItem key={index} url={file} />
                ))}
            </ul>
        </div>
    );
};

export default FileList;
