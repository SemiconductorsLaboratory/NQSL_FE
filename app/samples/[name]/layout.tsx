'use client';

import React, { ReactNode, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import "../../../styles/layoutData.css";
import { useDetailSampleQuery } from "@/redux/features/sampleApiSlice";

import { Modal } from "@/components/Modal/Modal";
import ModalExperiment from "@/components/Modal/Modal-Experiment";
import MethodBlock from '@/components/LayoutData/MethodBlock';
import PrevSampleBlock from '@/components/LayoutData/PreSampleBlock';
import SubstrateSection from '@/components/LayoutData/SubstrateBlock';
import Resizer from '@/components/LayoutData/Resizer';
import NextSampleBlock from '@/components/LayoutData/NextSampleBlock';

interface LayoutProps {
    children: ReactNode;
}

const SampleDataLayout: React.FC<LayoutProps> = ({ children }) => {
    const { name } = useParams() as { name?: string };
    const router = useRouter();

    const { data: detailData, isLoading } = useDetailSampleQuery(name || "", {
        skip: !name,
    });

    const [columnWidth, setColumnWidth] = useState(50); // Width in percentage
    const containerRef = useRef<HTMLDivElement>(null);

    const handleResize = (delta: number) => {
        if (containerRef.current) {
            const newWidth = (containerRef.current.clientWidth * (columnWidth / 100)) + delta;
            const newWidthPercentage = (newWidth / containerRef.current.clientWidth) * 100;
            setColumnWidth(Math.min(Math.max(newWidthPercentage, 30), 80));
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!name || isLoading || !detailData) {
        return <p>Loading...</p>;
    }

    const handleClick = (method: string, id: string) => {
        router.push(`/samples/${name}/${method}/${id}`);
    };

    return (
        <div className="container-data" ref={containerRef}>
            <div className="sample-data" style={{ width: `${columnWidth}%` }}>
                {detailData.substrate && (
                    <SubstrateSection
                        substrateName={detailData.substrate.id?.toString() || null}
                        substrateId={detailData.substrate.id || null}
                        name={name}
                    />
                )}

                {detailData.sample_list.length > 1 && (
                    <PrevSampleBlock
                        sampleList={detailData.sample_list}
                        experimentList={detailData.experiment_list}
                        onClick={handleClick}
                    />
                )}

                <div className="container-sample-block">
                    <MethodBlock
                        items={detailData.experiment_list[detailData.sample_list.length - 1]}
                        onClick={handleClick}
                        sampleName={name}
                    />
                    <button onClick={() => setIsModalOpen(true)} className="open-modal-button">
                        <div className="method-block-add">bite</div>
                    </button>
                </div>

                {detailData.next_sample_list.length > 0 && (
                    <NextSampleBlock nextSampleList={detailData.next_sample_list} />
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