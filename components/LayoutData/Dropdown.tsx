import React, { useState } from 'react';
import MethodBlock from './MethodBlock';

interface DropdownProps {
    title: string;
    items: any[];
    onClick: (model: string, id: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, items, onClick }) => {
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
                        <MethodBlock items={items} onClick={onClick} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
