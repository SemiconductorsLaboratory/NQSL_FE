'use client';

import React, { useEffect, useState } from "react";
import "./PeriodicTable.css";
import { useListElementQuery } from "@/redux/features/sampleApiSlice";

interface Element {
    id: number; // Assuming each element has a unique ID
    Symbol: string;
    name: string;
    atomic_number: number;
    group: number;
    period: number;
}

interface PeriodicTableProps {
    onSelectElement: (elementData: { id: number; symbol: string }) => void; // Update the callback to accept an object with ID and Symbol
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onSelectElement }) => {
    // @ts-ignore
    const { data: elementsData, isLoading, error } = useListElementQuery();
    const [elements, setElements] = useState<Element[]>([]);
    const [selectedElement, setSelectedElement] = useState<number | null>(null); // État pour l'élément sélectionné unique

    useEffect(() => {
        if (Array.isArray(elementsData)) {
            const sortedElements = [...elementsData].sort(
                (a: Element, b: Element) => a.atomic_number - b.atomic_number
            );
            setElements(sortedElements);
        } else {
            console.log("No valid elements data received");
        }
    }, [elementsData]);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading elements</p>;

    // Fonction pour gérer la sélection d'un élément unique
    const handleElementClick = (element: Element) => {
        setSelectedElement(element.atomic_number); // Définir le numéro atomique comme l'élément sélectionné unique
        onSelectElement({ id: element.id, symbol: element.Symbol }); // Appeler la fonction avec l'ID et le symbole de l'élément
    };

    return (
        <div className="periodic-table-grid">
            {elements.map((element) => (
                <div
                    key={element.atomic_number}
                    className={`element ${selectedElement === element.atomic_number ? 'selected' : ''}`} // Ajouter la classe 'selected' si l'élément est sélectionné
                    onClick={() => handleElementClick(element)}
                    style={{
                        gridRow: element.period,
                        gridColumn: element.group,
                    }}
                >
                    <div className="symbol">{element.Symbol}</div>
                    <div className="atomic-number">{element.atomic_number}</div>
                </div>
            ))}
        </div>
    );
};

export default PeriodicTable;