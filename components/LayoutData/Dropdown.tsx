import React, { useState } from 'react';
import MethodBlock from './MethodBlock';
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./styles/Dropdown.css";

interface DropdownProps {
    title: string;
    items: any[];
    onClick: (model: string, id: string) => void;
    sampleName: string;
}

const Dropdown: React.FC<DropdownProps> = ({ title, items, onClick, sampleName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/samples/${sampleName}/`);
    };

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
                <h3>{title}</h3>
                <Image
                    onClick={toggleLink}
                    src="/arrow-up-right-from-square.png"
                    width={25}
                    height={25}
                    alt="pen"
                    className="dropdown-link-icon"
                />
            </div>
            <div className={"line"}></div>
            {isOpen && (
                <div className="dropdown-body">
                    <div className="dropdown-methode">
                        <MethodBlock items={items} onClick={onClick} sampleName={sampleName} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;