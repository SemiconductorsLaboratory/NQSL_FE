import React, { useState } from 'react';

interface SubstrateSectionProps {
    onSubstrateChange: (substrate: Substrate) => void;
}

type LayerComp = {
    element: number;
    percentage: number;
};

type Layer = {
    layer_thickness: number;
    name: string;
    doped: string | null;
    doped_percentage: number | null;
    layer_comp: LayerComp[];
};

type Substrate = {
    Company: string;
    date_created: string;
    layers: Layer[];
};

const SubstrateSection: React.FC<SubstrateSectionProps> = ({ onSubstrateChange }) => {
    const [substrate, setSubstrate] = useState<Substrate>({
        Company: '',
        date_created: '',
        layers: [],
    });

    const handleLayerChange = (index: number, field: keyof Layer, value: any) => {
        const newLayers = [...substrate.layers];
        newLayers[index] = { ...newLayers[index], [field]: value };
        setSubstrate({ ...substrate, layers: newLayers });
        onSubstrateChange({ ...substrate, layers: newLayers });
    };

    const handleLayerCompChange = (layerIndex: number, compIndex: number, field: keyof LayerComp, value: any) => {
        const newLayers = [...substrate.layers];
        newLayers[layerIndex].layer_comp[compIndex] = { ...newLayers[layerIndex].layer_comp[compIndex], [field]: value };
        setSubstrate({ ...substrate, layers: newLayers });
        onSubstrateChange({ ...substrate, layers: newLayers });
    };

    const addLayer = () => {
        const newLayers = [...substrate.layers, { layer_thickness: 0, name: '', doped: null, doped_percentage: null, layer_comp: [] }];
        setSubstrate({ ...substrate, layers: newLayers });
        onSubstrateChange({ ...substrate, layers: newLayers });
    };

    const addLayerComp = (layerIndex: number) => {
        const newLayers = [...substrate.layers];
        newLayers[layerIndex].layer_comp.push({ element: 0, percentage: 0 });
        setSubstrate({ ...substrate, layers: newLayers });
        onSubstrateChange({ ...substrate, layers: newLayers });
    };

    return (
        <div className="substrate-section">
            <input
                type="text"
                value={substrate.Company}
                onChange={(e) => {
                    setSubstrate({ ...substrate, Company: e.target.value });
                    onSubstrateChange({ ...substrate, Company: e.target.value });
                }}
                placeholder="Company"
                style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />
            <input
                type="date"
                value={substrate.date_created}
                onChange={(e) => {
                    setSubstrate({ ...substrate, date_created: e.target.value });
                    onSubstrateChange({ ...substrate, date_created: e.target.value });
                }}
                placeholder="Date Created"
                style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            />

            {substrate.layers.map((layer, layerIndex) => (
                <div key={layerIndex} className="layer-section">
                    <h3>Layer {layerIndex + 1}</h3>
                    <input
                        type="text"
                        value={layer.name}
                        onChange={(e) => handleLayerChange(layerIndex, 'name', e.target.value)}
                        placeholder="Layer Name"
                        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                    />
                    <input
                        type="number"
                        value={layer.layer_thickness}
                        onChange={(e) => handleLayerChange(layerIndex, 'layer_thickness', e.target.value)}
                        placeholder="Layer Thickness"
                        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                    />
                    {layer.layer_comp.map((comp, compIndex) => (
                        <div key={compIndex} className="layer-comp-section">
                            <input
                                type="number"
                                value={comp.element}
                                onChange={(e) => handleLayerCompChange(layerIndex, compIndex, 'element', e.target.value)}
                                placeholder="Element"
                                style={{ width: '48%', padding: '10px', margin: '10px 0', display: 'inline-block', marginRight: '4%' }}
                            />
                            <input
                                type="number"
                                value={comp.percentage}
                                onChange={(e) => handleLayerCompChange(layerIndex, compIndex, 'percentage', e.target.value)}
                                placeholder="Percentage"
                                style={{ width: '48%', padding: '10px', margin: '10px 0', display: 'inline-block' }}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={() => addLayerComp(layerIndex)}>Add Layer Comp</button>
                </div>
            ))}

            <button type="button" onClick={addLayer}>Add Layer</button>
        </div>
    );
};

export default SubstrateSection;