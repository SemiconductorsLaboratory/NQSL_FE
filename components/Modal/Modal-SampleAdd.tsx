import React, { useEffect, useState } from 'react';
import { useSampleAddMutation, useUserMachineQuery } from "@/redux/features/sampleApiSlice";
import { useGetSamplesQuery } from '@/redux/features/authApiSlice';
import "./styles/Modal-SampleAdd.css";
import SearchbarComponentPrevSample from "@/components/common/Seatchbar-prev-sample";

type Sample = {
    id: string;
    name: string;
};

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

type ModalSampleAddProps = {
    refetchSamples: () => void;
};

const ModalSampleAdd: React.FC<ModalSampleAddProps> = ({ refetchSamples }) => {
    const [nameInput, setNameInput] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [isNameTaken, setIsNameTaken] = useState(false);
    const [prevSample, setPrevSample] = useState<Sample | null>(null);
    const [substrate, setSubstrate] = useState<Substrate>({
        Company: '',
        date_created: '',
        layers: [],
    });

    const [isPrevSampleChecked, setIsPrevSampleChecked] = useState(false);
    const [isSubstrateChecked, setIsSubstrateChecked] = useState(false);

    // @ts-ignore
    const { data: samples, isLoading: samplesLoading } = useGetSamplesQuery();
    // @ts-ignore
    const { data: userList, isLoading: userLoading } = useUserMachineQuery();
    const [sampleAdd, { isLoading: isSubmitting }] = useSampleAddMutation();

    const currentDate = new Date().toLocaleDateString();

    const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(event.target.value);
    };

    const handlePrevSampleSelect = (sample: Sample) => {
        setPrevSample(sample);
    };

    useEffect(() => {
        if (nameInput.trim() && Array.isArray(samples)) {
            setIsNameTaken(samples.some((sample: { name: string }) =>
                sample.name.toLowerCase() === nameInput.trim().toLowerCase()
            ));
        } else {
            setIsNameTaken(false);
        }
    }, [nameInput, samples]);

    const handleLayerChange = (index: number, field: keyof Layer, value: any) => {
        const newLayers = [...substrate.layers];
        newLayers[index] = { ...newLayers[index], [field]: value };
        setSubstrate({ ...substrate, layers: newLayers });
    };

    const handleLayerCompChange = (layerIndex: number, compIndex: number, field: keyof LayerComp, value: any) => {
        const newLayers = [...substrate.layers];
        newLayers[layerIndex].layer_comp[compIndex] = { ...newLayers[layerIndex].layer_comp[compIndex], [field]: value };
        setSubstrate({ ...substrate, layers: newLayers });
    };

    const addLayer = () => {
        setSubstrate({
            ...substrate,
            layers: [...substrate.layers, { layer_thickness: 0, name: '', doped: null, doped_percentage: null, layer_comp: [] }],
        });
    };

    const addLayerComp = (layerIndex: number) => {
        const newLayers = [...substrate.layers];
        newLayers[layerIndex].layer_comp.push({ element: 0, percentage: 0 });
        setSubstrate({ ...substrate, layers: newLayers });
    };

    const handleSubmit = async () => {
        if (!selectedUser || !nameInput.trim() || !description.trim() || isNameTaken) {
            return;
        }

        const currentDate = new Date().toISOString();

        // Combiner sampleData et substrateData dans une seule structure
        const payload = {
            sample: {
                user_machine: Number(selectedUser),
                name: nameInput,
                description,
                date_created: currentDate,
                prev_sample: prevSample ? String(prevSample.id) : "", // Envoie une chaîne vide si prevSample est null
            },
            substrate: isSubstrateChecked ? {
                Company: substrate.Company,
                date_created: substrate.date_created,
                layers: substrate.layers.map(layer => ({
                    layer_thickness: parseFloat(String(layer.layer_thickness)),
                    name: layer.name,
                    doped: layer.doped,
                    doped_percentage: layer.doped_percentage,
                    layer_comp: layer.layer_comp.map(comp => ({
                        element: parseInt(String(comp.element), 10),
                        percentage: parseFloat(String(comp.percentage))
                    }))
                }))
            } : null
        };

        console.log('Payload:', payload);

        try {
            const response = await sampleAdd(payload).unwrap();
            alert('Sample added successfully');
            refetchSamples();
            setNameInput('');
            setDescription('');
            setSelectedUser(null);
            setPrevSample(null);
            setSubstrate({ Company: '', date_created: '', layers: [] });
            setIsPrevSampleChecked(false);
            setIsSubstrateChecked(false);
        } catch (error: any) {
            console.error('Failed to add sample', error);
            alert('Failed to add sample. Please check your inputs and try again.');
        }
    };


    if (userLoading || samplesLoading || isSubmitting) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container-modalAdd">
            <div className="sample-info">
                <h2>Date: {currentDate}</h2>
                <input
                    className={"name-input"}
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter name"
                    style={{ width: '100%', padding: '10px', margin: '10px 0', borderColor: isNameTaken ? 'red' : 'initial' }}
                />
                {isNameTaken && <p style={{ color: 'red' }}>This name is already taken.</p>}

                <select
                    value={selectedUser || ''}
                    onChange={handleUserSelect}
                    style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                >
                    <option value="" disabled>Select a user</option>
                    {userList && userList.length > 0 && userList.map((user: { id: string, name: string }, index: number) => (
                        <option key={index} value={user.id}>{user.name}</option>
                    ))}
                </select>

                <h2>Description</h2>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={5}
                    style={{ width: '100%' }}
                />
            </div>

            <div className={"sample-line"}></div>

            <div className="sample-prevSample">
                <div className="sections-container">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={isPrevSampleChecked}
                                onChange={() => setIsPrevSampleChecked(!isPrevSampleChecked)}
                            />
                            <button className={"header-sample"}>Previous Sample</button>
                        </div>
                        <div className={"line"}></div>
                        {isPrevSampleChecked && (
                            <div className="section-content">
                                <SearchbarComponentPrevSample onSelect={handlePrevSampleSelect} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={"sample-line"}></div>

            <div className="sample-substrate">
                <div className="sections-container">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={isSubstrateChecked}
                                onChange={() => setIsSubstrateChecked(!isSubstrateChecked)}
                            />
                            <button className={"header-sample"}>Substrate</button>
                        </div>
                        <div className={"line"}></div>
                        {isSubstrateChecked && (
                            <div className="section-content">
                                <h3>Substrate Information</h3>
                                <label>
                                    Company:
                                    <input
                                        type="text"
                                        value={substrate.Company}
                                        onChange={(e) => setSubstrate({ ...substrate, Company: e.target.value })}
                                        placeholder="Company"
                                        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                                    />
                                </label>
                                <label>
                                    Date Created:
                                    <input
                                        type="date"
                                        value={substrate.date_created}
                                        onChange={(e) => setSubstrate({ ...substrate, date_created: e.target.value })}
                                        placeholder="Date Created"
                                        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                                    />
                                </label>

                                {substrate.layers.map((layer, layerIndex) => (
                                    <div key={layerIndex} className="layer-section">
                                        <h3>Layer {layerIndex + 1}</h3>
                                        <label>
                                            Layer Name:
                                            <input
                                                type="text"
                                                value={layer.name}
                                                onChange={(e) => handleLayerChange(layerIndex, 'name', e.target.value)}
                                                placeholder="Layer Name"
                                                style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                                            />
                                        </label>
                                        <label>
                                            Layer Thickness:
                                            <input
                                                type="number"
                                                value={layer.layer_thickness}
                                                onChange={(e) => handleLayerChange(layerIndex, 'layer_thickness', e.target.value)}
                                                placeholder="Layer Thickness"
                                                style={{ width: '100%', padding: '10px', margin: '10px 0' }}
                                            />
                                        </label>
                                        {layer.layer_comp.map((comp, compIndex) => (
                                            <div key={compIndex} className="layer-comp-section">
                                                <label>
                                                    Element:
                                                    <input
                                                        type="number"
                                                        value={comp.element}
                                                        onChange={(e) => handleLayerCompChange(layerIndex, compIndex, 'element', e.target.value)}
                                                        placeholder="Element"
                                                        style={{ width: '48%', padding: '10px', margin: '10px 0', display: 'inline-block', marginRight: '4%' }}
                                                    />
                                                </label>
                                                <label>
                                                    Percentage:
                                                    <input
                                                        type="number"
                                                        value={comp.percentage}
                                                        onChange={(e) => handleLayerCompChange(layerIndex, compIndex, 'percentage', e.target.value)}
                                                        placeholder="Percentage"
                                                        style={{ width: '48%', padding: '10px', margin: '10px 0', display: 'inline-block' }}
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addLayerComp(layerIndex)}>Add Layer Comp</button>
                                    </div>
                                ))}

                                <button type="button" onClick={addLayer}>Add Layer</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={"sample-submit"}>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isNameTaken || !nameInput.trim() || !selectedUser || !description.trim()}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ModalSampleAdd;