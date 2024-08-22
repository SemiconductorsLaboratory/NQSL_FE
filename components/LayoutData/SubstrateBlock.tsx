import React from 'react';
import { useRouter } from 'next/navigation';

interface SubstrateSectionProps {
    substrateName: string | null;
    substrateId: string | null;
    name: string | undefined;
}

const SubstrateSection: React.FC<SubstrateSectionProps> = ({ substrateName, substrateId, name }) => {
    const router = useRouter();

    const handleSubstrateClick = () => {
        if (substrateId) {
            router.push(`/samples/${name}/substrate/${substrateId}`);
        } else {
            console.error("Substrate ID is not defined");
        }
    };

    return (
        <div className="container-substrate">
            <div className="label">
                S<br/>
                u<br/>
                b<br/>
            </div>
            {substrateName && (
                <div className={"substrate substrate-border"} onClick={handleSubstrateClick}>
                    <p>Substrate</p>
                </div>
            )}
        </div>
    );
};

export default SubstrateSection;
