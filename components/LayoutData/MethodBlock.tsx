import React, { useState } from 'react';
import Image from 'next/image';
import { useSEMDeleteMutation, useAFMDeleteMutation, useDetailSampleQuery } from "@/redux/features/sampleApiSlice";
import { useRouter, usePathname } from "next/navigation";

interface MethodBlockProps {
    items: any[];
    onClick: (model: string, id: string) => void;
    sampleName: string;
}

const MethodBlock: React.FC<MethodBlockProps> = ({ items: initialItems, onClick, sampleName }) => {
    const [items, setItems] = useState(initialItems);
    const [SEMDelete] = useSEMDeleteMutation();
    const [AFMDelete] = useAFMDeleteMutation();
    const { refetch } = useDetailSampleQuery(sampleName);
    const router = useRouter();
    const pathname = usePathname();

    const getMethodClass = (model: string) => {
        if (model === 'sem' || model === 'hrsem') {
            return 'method-border-red';
        } else if (model === 'afm' || model === 'kpafm') {
            return 'method-border-blue';
        } else {
            return '';
        }
    };

    const handleDelete = async (id: string, model: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item ?");
        if (!confirmDelete) {
            return;
        }

        try {
            if (model === 'afm' || model === 'kpafm') {
                await AFMDelete(id).unwrap();
                console.log(`Deleted AFM item with id: ${id}`);
            } else if (model === 'sem' || model === 'hrsem') {
                await SEMDelete(id).unwrap();
                console.log(`Deleted SEM item with id: ${id}`);
            }

            setItems(items.filter(item => item.id !== id));
            refetch();

            const isOnMethodPage = pathname.includes(`/sem/${id}`) || pathname.includes(`/afm/${id}`);
            if (isOnMethodPage) {
                router.push(`/samples/${sampleName}/`);
            }
        } catch (error) {
            console.error(`Failed to delete item with id: ${id}`, error);
        }
    };

    return (
        <div className="sample-block">
            {items.map((item, index) => (
                <div
                    key={`${item.id}-${index}`}
                    className={`method-block ${getMethodClass(item.model || '')}`}
                    onClick={() => onClick(item.model, item.id)}
                    style={{ position: 'relative' }}
                >
                    <div className="method-content">
                        <h3>{item.model ? item.model.toUpperCase() : 'UNKNOWN MODEL'}</h3>
                        <p className={"date-method"}>{item.created_at}</p>
                    </div>
                    <div
                        className="method-right"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id, item.model).then(() => {
                                console.log(`Successfully deleted item with id: ${item.id}`);
                            }).catch(error => {
                                console.error('Error during deletion:', error);
                            });
                        }}
                    >
                        <Image
                            src="/trash.png"
                            alt="Delete"
                            width={25}
                            height={25}
                            className="trash-icon"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MethodBlock;