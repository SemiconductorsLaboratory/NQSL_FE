import React from 'react';

interface MethodBlockProps {
    items: any[];
    onClick: (model: string, id: string) => void;
}

const MethodBlock: React.FC<MethodBlockProps> = ({ items, onClick }) => {
    const getMethodClass = (model: string) => {
        if (model === 'sem' || model === 'hrsem') {
            return 'method-border-red';
        } else if (model === 'afm' || model === 'kpafm') {
            return 'method-border-blue';
        } else {
            return '';
        }
    };

    return (
        <div className="sample-block">
            {items.map((item) => (
                <div
                    key={item.id}
                    className={`method-block ${getMethodClass(item.model || '')}`}
                    onClick={() => onClick(item.model, item.id)}
                >
                    <h3>{item.model ? item.model.toUpperCase() : 'UNKNOWN MODEL'}</h3>
                    <p className={"date-method"}>{item.created_at}</p>
                </div>
            ))}
        </div>
    );
};

export default MethodBlock;
