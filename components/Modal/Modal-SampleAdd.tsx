import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSampleAddMutation, useUserMachineQuery } from "@/redux/features/sampleApiSlice";
import { useGetSamplesQuery } from '@/redux/features/authApiSlice';
import PeriodicTable from '@/components/Modal/SampleAdd/PeriodicTable';
import "./styles/Modal-SampleAdd.css";
import SearchbarComponentPrevSample from "@/components/common/Seatchbar-prev-sample";

type Sample = {
    id: string;
    name: string;
};

type LayerComp = {
    element: number;
    symbol: string;
    percentage: number;
};

type Layer = {
    layer_thickness: number;
    name: string;
    doped: number | null;
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

    const [isLayerCompPopupOpen, setIsLayerCompPopupOpen] = useState(false);
    const [layerIndexForComp, setLayerIndexForComp] = useState<number | null>(null);
    const [newElementId, setNewElementId] = useState<number | null>(null);
    const [newElementSymbol, setNewElementSymbol] = useState<string>('');
    const [newPercentage, setNewPercentage] = useState<number | string>('');

    // @ts-ignore
    const { data: samples, isLoading: samplesLoading } = useGetSamplesQuery();
    // @ts-ignore
    const { data: userList, isLoading: userLoading } = useUserMachineQuery();
    const [sampleAdd, { isLoading: isSubmitting }] = useSampleAddMutation();

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

    const addLayer = () => {
        setSubstrate({
            ...substrate,
            layers: [...substrate.layers, { layer_thickness: 0, name: '', doped: null, doped_percentage: null, layer_comp: [] }],
        });
    };

    const openLayerCompPopup = (layerIndex: number) => {
        setLayerIndexForComp(layerIndex);
        setIsLayerCompPopupOpen(true);
    };

    const closeLayerCompPopup = () => {
        setIsLayerCompPopupOpen(false);
        setNewPercentage('');
        setNewElementId(null);
        setNewElementSymbol('');
    };

    const handleElementSelect = (elementData: { id: number; symbol: string }) => {
        setNewElementId(elementData.id);
        setNewElementSymbol(elementData.symbol);
    };

    const handleLayerCompChange = (layerIndex: number, compIndex: number, field: keyof LayerComp, value: any) => {
        const newLayers = [...substrate.layers];
        newLayers[layerIndex].layer_comp[compIndex] = {
            ...newLayers[layerIndex].layer_comp[compIndex],
            [field]: value,
        };
        setSubstrate({ ...substrate, layers: newLayers });
    };

    const addLayerComp = () => {
        if (layerIndexForComp !== null && newElementId && newPercentage) {
            const newLayers = [...substrate.layers];
            newLayers[layerIndexForComp].layer_comp.push({
                element: newElementId,
                symbol: newElementSymbol,
                percentage: parseFloat(String(newPercentage)),
            });
            setSubstrate({ ...substrate, layers: newLayers });
            closeLayerCompPopup();
        }
    };

    const handleSubmit = async () => {
        if (!selectedUser || !nameInput.trim() || !description.trim() || isNameTaken) {
            console.log("Form validation failed");
            return;
        }

        // Log the current state of inputs before payload creation
        console.log("Selected User:", selectedUser);
        console.log("Name Input:", nameInput);
        console.log("Description:", description);
        console.log("Date Created:", substrate.date_created);
        console.log("Previous Sample:", prevSample);

        // Log the substrate state
        console.log("Substrate state:", substrate);

        const payload = {
            sample: {
                user_machine: Number(selectedUser),
                name: nameInput,
                description,
                date_created: substrate.date_created,
                prev_sample: prevSample ? String(prevSample.id) : "",
            },
            substrate: isSubstrateChecked
                ? {
                    Company: substrate.Company,
                    date_created: substrate.date_created,
                    layers: substrate.layers.map((layer) => ({
                        layer_thickness: parseFloat(String(layer.layer_thickness)),
                        name: layer.name,
                        doped: layer.doped !== null ? parseInt(String(layer.doped), 10) : null,
                        doped_percentage: layer.doped_percentage !== null ? parseFloat(String(layer.doped_percentage)) : null,
                        layer_comp: layer.layer_comp.map((comp) => ({
                            element: parseInt(String(comp.element), 10),
                            symbol: comp.symbol,
                            percentage: parseFloat(String(comp.percentage)),
                        })),
                    })),
                }
                : null,
        };

        console.log("Payload to be sent:", JSON.stringify(payload, null, 2));

        try {
            const response = await sampleAdd(payload).unwrap();
            console.log("Response received:", response);

            alert("Sample added successfully");
            refetchSamples();
            setNameInput("");
            setDescription("");
            setSelectedUser(null);
            setPrevSample(null);
            setSubstrate({ Company: "", date_created: "", layers: [] });
            setIsPrevSampleChecked(false);
            setIsSubstrateChecked(false);
        } catch (error: any) {
            console.error("Failed to add sample:", error);
            alert("Failed to add sample. Please check your inputs and try again.");
        }
    };

    if (userLoading || samplesLoading || isSubmitting) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container-modalAdd">
            <div className="sample-info">
                <input
                    className={"name-input"}
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter name"
                    style={{
                        width: '100%',
                        padding: '10px',
                        margin: '10px 0',
                        borderColor: isNameTaken ? 'red' : 'initial'
                    }}
                />
                {isNameTaken && <p style={{color: 'red'}}>This name is already taken.</p>}

                <select
                    value={selectedUser || ''}
                    onChange={handleUserSelect}
                    style={{width: '100%', padding: '10px', margin: '10px 0'}}
                >
                    <option value="" disabled>Select a user</option>
                    {userList && userList.length > 0 && userList.map((user: {
                        id: string,
                        name: string
                    }, index: number) => (
                        <option key={index} value={user.id}>{user.name}</option>
                    ))}
                </select>

                <label>
                    Date Created:
                    <input
                        type="date"
                        value={substrate.date_created}
                        onChange={(e) => setSubstrate({...substrate, date_created: e.target.value})}
                        placeholder="Date Created"
                        style={{width: '100%', padding: '10px', margin: '10px 0'}}
                    />
                </label>

                <h2>Description</h2>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={5}
                    style={{width: '100%'}}
                />
            </div>

            <div className={"sample-line"}></div>

            <div className="sample-prevSample">
                <div className="sections-container">
                    <div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <input
                                type="checkbox"
                                checked={isPrevSampleChecked}
                                onChange={() => {
                                    setIsPrevSampleChecked(!isPrevSampleChecked);
                                    if (!isPrevSampleChecked) {
                                        setIsSubstrateChecked(false);
                                    }
                                }}
                            />
                            <p className={"header-sample"}>Previous Sample</p>
                        </div>
                        <div className={"line"}></div>
                        {isPrevSampleChecked && (
                            <div className="section-content">
                                <SearchbarComponentPrevSample onSelect={handlePrevSampleSelect}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className={"sample-line"}></div>

            <div className="sample-substrate">
                <div className="sections-container">
                    <div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <input
                                type="checkbox"
                                checked={isSubstrateChecked}
                                onChange={() => {
                                    setIsSubstrateChecked(!isSubstrateChecked);
                                    if (!isSubstrateChecked) {
                                        setIsPrevSampleChecked(false);
                                    }
                                }}
                            />
                            <p className={"header-sample"}>Substrate</p>
                        </div>
                        <div className={"line"}></div>
                        {isSubstrateChecked && (
                            <div className="section-content">
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

                                <table className="substrate-table">
                                    <thead>
                                    <tr>
                                        <th>Layer Name</th>
                                        <th>Layer Thickness (µm)</th>
                                        <th>Layer Composition</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {substrate.layers.map((layer, layerIndex) => (
                                        <tr key={layerIndex}>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={layer.name}
                                                    onChange={(e) => handleLayerChange(layerIndex, 'name', e.target.value)}
                                                    placeholder="Layer Name"
                                                    style={{ width: '100%', padding: '5px' }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={layer.layer_thickness}
                                                    onChange={(e) => handleLayerChange(layerIndex, 'layer_thickness', e.target.value)}
                                                    placeholder="Layer Thickness"
                                                    style={{ width: '100%', padding: '5px' }}
                                                />
                                            </td>
                                            <td>
                                                {layer.layer_comp.map((comp, compIndex) => (
                                                    <div key={`comp-${layerIndex}-${compIndex}`} className="layer-comp-section">
                                                        <label>
                                                            <p className={"elements"}>{comp.symbol}</p> {/* Utilisez `comp.symbol` ici */}
                                                        </label>
                                                        <label>
                                                            <input
                                                                className={"input-elementsPercentage"}
                                                                type="number"
                                                                value={comp.percentage}
                                                                onChange={(e) => handleLayerCompChange(layerIndex, compIndex, 'percentage', e.target.value)}
                                                                placeholder="Percentage"
                                                            />
                                                        </label>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => openLayerCompPopup(layerIndex)}
                                                        style={{background: 'none', border: 'none'}}>
                                                    <Image src="/plus.png" alt="Add Layer Comp" width={24} height={24}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <button type="button" onClick={addLayer} style={{background: 'none', border: 'none'}}>
                                    <Image src="/plus.png" alt="Add Layer" width={24} height={24}/>
                                </button>
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

            {isLayerCompPopupOpen && (
                <div className="layer-comp-popup">
                    <div className="popup-content">
                        <PeriodicTable onSelectElement={handleElementSelect} />
                        <label>
                            <div className="popup-actions">
                                <div className="percentage">
                                    Percentage:
                                    <input
                                        type="number"
                                        value={newPercentage}
                                        onChange={(e) => setNewPercentage(e.target.value)}
                                        placeholder="Percentage"
                                    />
                                </div>
                                <div className="popup-actions2">
                                    <button onClick={addLayerComp} style={{marginRight: '10px'}}>Add</button>
                                    <button onClick={closeLayerCompPopup}>Cancel</button>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalSampleAdd;