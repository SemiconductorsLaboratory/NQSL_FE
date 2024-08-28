import React, {useState} from 'react';
import { useRouter } from 'next/navigation';

interface NextSampleBlockProps {
    nextSampleList: string[];
}

const NextSampleBlock: React.FC<NextSampleBlockProps> = ({ nextSampleList }) => {
    const router = useRouter();

    const handleNextSampleClick = (sampleName: string) => {
        router.push(`/samples/${sampleName}`);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container-next-sample">
            <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropdown}>
                    <h3>Next Sample</h3>
                </div>
                <div className={"line"}></div>
                {isOpen && (
                    <div className="dropdown-body">
                        <div className="dropdown-methode">
                            {nextSampleList.map((nextSample) => (
                                <div
                                    key={nextSample}
                                    className="next-sample-link method-border"
                                    onClick={() => handleNextSampleClick(nextSample)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <a>{nextSample}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NextSampleBlock;
