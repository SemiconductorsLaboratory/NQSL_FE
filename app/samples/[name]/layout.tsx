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

const SubstrateBlock: React.FC<{ substrateName: string | null, onClick: () => void }> = ({ substrateName, onClick }) => (
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

const Dropdown: React.FC<{ title: string, items: any[] }> = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <h3>{title}</h3>
            </div>
            {isOpen && (
                <div className="dropdown-body">
                    {items.map((item, index) => (
                        <MethodBlock key={index} item={item} onClick={() => { /* Naviguer vers la méthode correspondante */ }} />
                    ))}
                    end
                </div>
            )}
        </div>
    );
};

const SampleDataLayout: React.FC<LayoutProps> = ({ children }) => {
    const params = useParams();
    const { name } = params as { name?: string };
    const router = useRouter();

    const { data: detailData, error: detailError, isLoading: detailLoading } = useDetailSampleQuery(name, {
        skip: !name,
    });

    const { data: prevSampleData, error: prevSampleError, isLoading: prevSampleLoading } = useDetailSampleQuery(detailData?.prev_sample, {
        skip: !detailData?.prev_sample,
    });

    const [columnWidth, setColumnWidth] = useState(50); // Width in percentage
    const containerRef = useRef<HTMLDivElement>(null);

    const handleResize = (delta: number) => {
        if (containerRef.current) {
            const newWidth = (containerRef.current.clientWidth * (columnWidth / 100)) + delta;
            const newWidthPercentage = (newWidth / containerRef.current.clientWidth) * 100;
            setColumnWidth(Math.min(Math.max(newWidthPercentage, 27), 80));
        }
    };

    const [substrateName, setSubstrateName] = useState<string | null>(null);
    const [substrateId, setSubstrateId] = useState<string | null>(null);

    useEffect(() => {
        console.log('Raw API Data:', detailData); // Log des données brutes de l'API
        if (detailData) {
            if (detailData.substrate) {
                console.log('Substrate Data:', detailData.substrate); // Log des détails du substrate
                if (detailData.substrate.id) { // Utilisation de l'ID comme identifiant principal
                    console.log('Substrate ID:', detailData.substrate.id); // Log de l'ID du substrate
                    setSubstrateName(detailData.substrate.id.toString());
                    setSubstrateId(detailData.substrate.id);
                } else {
                    console.log('Substrate ID is missing.');
                }
            } else {
                console.log('Substrate is missing in detailData.');
            }
        } else {
            console.log('No detail data available.');
        }
    }, [detailData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!name) {
        return <p>No name provided</p>;
    }

    if (!detailData) {
        console.log('No detail data available.');
        return <p>No data available</p>;
    }

    let combinedData = [
        ...(detailData.sem ? detailData.sem.map((item: any) => ({ ...item, method: 'sem', id: item.id })) : []),
        ...(detailData.afm ? detailData.afm.map((item: any) => ({ ...item, method: 'afm', id: item.id })) : []),
    ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    // Ajouter les méthodes du prev_sample s'il existe et si ses données ont été récupérées
    let prevSampleMethods: string | any[] = [];
    if (prevSampleData) {
        prevSampleMethods = [
            ...(prevSampleData.sem ? prevSampleData.sem.map((item: any) => ({
                ...item,
                method: 'sem',
                id: item.id,
                fromPrevSample: true
            })) : []),
            ...(prevSampleData.afm ? prevSampleData.afm.map((item: any) => ({
                ...item,
                method: 'afm',
                id: item.id,
                fromPrevSample: true
            })) : []),
        ];
    }

    const handleClick = (method: string, id: string) => {
        router.push(`/samples/${name}/${method}/${id}`);
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
                {substrateName && (
                    <SubstrateBlock substrateName={substrateName} onClick={handleSubstrateClick} />
                )}
                {prevSampleMethods.length > 0 && (
                    <Dropdown title={`Prev Sample: ${detailData?.prev_sample}`} items={prevSampleMethods} />
                )}
                {combinedData.length > 0 && (
                    <SampleList combinedData={combinedData} onClick={handleClick} onAddNew={() => setIsModalOpen(true)} />
                )}
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
