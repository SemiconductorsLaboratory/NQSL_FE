import React from 'react';
import { useRouter } from 'next/navigation';

interface NextSampleBlockProps {
    nextSampleList: string[];
}

const NextSampleBlock: React.FC<NextSampleBlockProps> = ({ nextSampleList }) => {
    const router = useRouter();

    const handleNextSampleClick = (sampleName: string) => {
        router.push(`/samples/${sampleName}`);
    };

    return (
        <div className="container-next-sample">
            <div className="label">
                N<br/>
                e<br/>
                x<br/>
                t<br/>
            </div>
            <div className="next-methode">
                {nextSampleList.map((nextSample) => (
                    <div
                        key={nextSample}
                        className="next-sample-link method-border"
                        onClick={() => handleNextSampleClick(nextSample)}
                        style={{ cursor: 'pointer' }}
                    >
                        <a>{nextSample}</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NextSampleBlock;
