'use client';

import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import "../../../styles/layoutData.css";
import { useDetailSampleQuery, useSubstrateSampleQuery } from "@/redux/features/sampleApiSlice";
import { Modal } from "@/components/Modal/Modal";
import ModalExperiment from "@/components/Modal/Modal-Experiment";

interface LayoutProps {
    children: ReactNode;
}

const Resizer: React.FC<{ onResize: (newWidth: number) => void }> = ({ onResize }) => {
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

const SubstrateBlock: React.FC<{ substrateId: string | null, onClick: () => void }> = ({ substrateId, onClick }) => (
    <div className={"substrate substrate-border"} onClick={onClick}>
        <p>Substrate</p>
    </div>
);

const MethodBlock: React.FC<{ item: any, onClick: () => void }> = ({ item, onClick }) => {
    const getMethodClass = (method: string) => {
        if (method === 'sem' || method === 'hrsem') {
            return 'method-border-red';
        } else if (method === 'afm' || method === 'kpafm') {
            return 'method-border-blue';
        } else {
            return '';
        }
    };

    return (
        <div
            className={`method-block ${getMethodClass(item.method)}`}
            onClick={onClick}
        >
            <h3>{item.method.toUpperCase()}</h3>
            <p className={"date-method"}>{item.created_at}</p>
            <p className={"description-method"}>{item.description}</p>
        </div>
    );
};

const SampleList: React.FC<{ combinedData: any[], onClick: (method: string, id: string) => void, onAddNew: () => void }> = ({ combinedData, onClick, onAddNew }) => (
    <>
        {combinedData.map((item, index) => (
            <MethodBlock key={index} item={item} onClick={() => onClick(item.method, item.id)} />
        ))}
        <div className={"method-block"} onClick={onAddNew}>
            <p>+</p>
        </div>
    </>
);

const SampleDataLayout: React.FC<LayoutProps> = ({ children }) => {
    const params = useParams();
    const { name } = params as { name?: string };
    const { data: detailData, error: detailError, isLoading: detailLoading } = useDetailSampleQuery(name, {
        skip: !name,
    });

    const router = useRouter();
    const [columnWidth, setColumnWidth] = useState(50); // Width in percentage
    const containerRef = useRef<HTMLDivElement>(null);

    const handleResize = (delta: number) => {
        if (containerRef.current) {
            const newWidth = (containerRef.current.clientWidth * (columnWidth / 100)) + delta;
            const newWidthPercentage = (newWidth / containerRef.current.clientWidth) * 100;
            setColumnWidth(Math.min(Math.max(newWidthPercentage, 27), 80));
        }
    };

    const [substrateId, setSubstrateId] = useState<string | null>(null);
    const { data: substrateData, error: substrateError, isLoading: substrateLoading } = useSubstrateSampleQuery(name, {
        skip: !name,
    });

    useEffect(() => {
        if (substrateData?.layers?.length > 0) {
            setSubstrateId(substrateData.layers[0].id_layer.toString());
        }
    }, [substrateData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!name) {
        return <p>No name provided</p>;
    }

    if (detailLoading || substrateLoading) {
        return <p>Loading...</p>;
    }

    if (detailError || substrateError) {
        return <p>Error loading data</p>;
    }

    if (!detailData) {
        return <p>No data available</p>;
    }

    // Ajouter prev_sample si substrate est vide
    let combinedData = [
        ...(detailData.sem ? detailData.sem.map((item: any) => ({ ...item, method: 'sem', id: item.id })) : []),
        ...(detailData.afm ? detailData.afm.map((item: any) => ({ ...item, method: 'afm', id: item.id })) : []),
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    if (!detailData.substrate && detailData.prev_sample) {
        combinedData.unshift({
            method: "prev_sample",
            created_at: "", // Vous pouvez ajouter la date ici si disponible
            description: detailData.prev_sample,
            id: "prev_sample"
        });
    }

    const handleClick = (method: string, id: string) => {
        if (method === 'prev_sample') {
            // Rediriger ou gérer le prev_sample selon vos besoins
            console.log("Clicked on prev_sample:", id);
        } else {
            router.push(`/samples/${name}/${method}/${id}`);
        }
    };

    const handleSubstrateClick = () => {
        if (substrateId) {
            router.push(`/samples/${name}/substrate/${substrateId}`);
        } else {
            console.error("Substrate ID is not defined");
        }
    };

    return (
        <div className="container-data" ref={containerRef}>
            <div className="sample-data" style={{ width: `${columnWidth}%` }}>
                <SubstrateBlock substrateId={substrateId} onClick={handleSubstrateClick} />
                <SampleList combinedData={combinedData} onClick={handleClick} onAddNew={() => setIsModalOpen(true)} />
            </div>
            <Resizer onResize={handleResize} />
            <div className="sample-methode" style={{ width: `${100 - columnWidth}%` }}>
                {children}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalExperiment />
            </Modal>
        </div>
    );
};

export default SampleDataLayout;