import React from 'react';
import Dropdown from './Dropdown';

interface PrevSampleBlockProps {
    sampleList: string[];
    experimentList: any[][];
    onClick: (model: string, id: string) => void;
    sampleName: string;
}

const PrevSampleBlock: React.FC<PrevSampleBlockProps> = ({ sampleList, experimentList, onClick }) => {
    const createDropdown = (sampleName: string, methods: any[]) => (
        <div className="prev-sample-block" key={sampleName}>
            <div className="dropdown-container">
                <Dropdown title={sampleName} items={methods} onClick={onClick} sampleName={sampleName}/>
            </div>
        </div>
    );

    return (
        <div className="container-prev-sample">
            {sampleList.map((sampleName: string, index: number) => {
                const methods = experimentList[index];
                if (methods.length > 0 && index < sampleList.length - 1) {
                    return createDropdown(sampleName, methods);
                }
                return null;
            })}
        </div>
    );
};

export default PrevSampleBlock;
