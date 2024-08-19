'use client';

import React, { ReactNode, useRef, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import "../../../styles/layoutData.css";
import { useDetailSampleQuery } from "@/redux/features/sampleApiSlice";
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

    const getMethodClass = (model: string) => {
        if (model === 'sem' || model === 'hrsem') {
            return 'method-border-red';
        } else if (model === 'afm' || model === 'kpafm') {
            return 'method-border-blue';
        } else {
            return '';
        }
    };

    // Utilisation de 'model' au lieu de 'method'
    const modelName = item.model ? item.model.toUpperCase() : 'UNKNOWN MODEL';

    return (
        <div
            className={`method-block ${getMethodClass(item.model || '')}`}
            onClick={onClick}
        >
            <h3>{modelName}</h3>
            <p className={"date-method"}>{item.created_at}</p>
        </div>
    );
};

const Dropdown: React.FC<{ title: string, items: any[], onClick: (model: string, id: string) => void }> = ({ title, items, onClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <h3>{title}</h3>
            </div>
            <div className={"line"}></div>
            {isOpen && (
                <div className="dropdown-body">
                    <div className="dropdown-methode">
                        {items.map((item, index) => (
                            <MethodBlock
                                key={index}
                                item={item}
                                onClick={() => onClick(item.model, item.id)}
                            />
                        ))}
                    </div>
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
        if (detailData) {
            if (detailData.substrate) {
                setSubstrateName(detailData.substrate.id.toString());
                setSubstrateId(detailData.substrate.id);
            }
        }
    }, [detailData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!name) {
        return <p>No name provided</p>;
    }

    if (!detailData) {
        return <p>No data available</p>;
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

    const createDropdown = (sampleName: string, methods: any[]) => (
        <div className="prev-sample-block" key={sampleName}>
            <div className="dropdown-container">
                <Dropdown title={sampleName} items={methods} onClick={handleClick} />
            </div>
        </div>
    );

    return (
        <div className="container-data" ref={containerRef}>
            <div className="sample-data" style={{ width: `${columnWidth}%` }}>
                {/* Afficher le substrate */}
                <div className={"container-substrate"}>
                    {substrateName && (
                        <SubstrateBlock substrateName={substrateName} onClick={handleSubstrateClick} />
                    )}
                </div>

                {/* Afficher les dropdowns directement ici */}
                <div className="container-prev-sample">
                    {detailData.sample_list.map((sampleName: string, index: number) => {
                        const methods = detailData.experiment_list[index];
                        if (methods.length > 0 && index < detailData.sample_list.length - 1) {
                            return createDropdown(sampleName, methods);
                        }
                        return null;
                    })}
                </div>

                {/* Afficher le dernier bloc directement */}
                <div className={"container-sample-block"}>
                    {detailData.sample_list.length > 0 && (
                        <div className="sample-block">
                            {detailData.experiment_list[detailData.sample_list.length - 1].map((method: any) => (
                                <MethodBlock
                                    key={method.id}
                                    item={method}
                                    onClick={() => handleClick(method.model, method.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
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