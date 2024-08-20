'use client';

import React, { useState, useEffect } from 'react';
import {
    useUserMachineQuery,
    useSampleAddMutation,
} from "@/redux/features/sampleApiSlice";
import { useGetSamplesQuery } from '@/redux/features/authApiSlice';
import "./styles/Modal-SampleAdd.css";
import SearchbarComponentPrevSample from "@/components/common/Seatchbar-prev-sample";

type ModalSampleAddProps = {
    refetchSamples: () => void;
};

const ModalSampleAdd: React.FC<ModalSampleAddProps> = ({ refetchSamples }) => {
    const [nameInput, setNameInput] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [isNameTaken, setIsNameTaken] = useState(false);

    // @ts-ignore
    const { data: samples, isLoading: samplesLoading } = useGetSamplesQuery(); // Fetching all samples
    // @ts-ignore
    const { data: userList, isLoading: userLoading } = useUserMachineQuery();

    const [sampleAdd, { isLoading: isSubmitting }] = useSampleAddMutation();

    const currentDate = new Date().toLocaleDateString();

    const handleUserSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(event.target.value);
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

    const handleSubmit = async () => {
        if (!selectedUser || !nameInput.trim() || !description.trim() || isNameTaken) {
            return;
        }

        const sampleData = {
            user_machine: selectedUser,
            name: nameInput,
            description,
            date_created: currentDate,
        };

        try {
            await sampleAdd(sampleData).unwrap();
            alert('Sample added successfully');
            refetchSamples();
            setNameInput('');
            setDescription('');
            setSelectedUser(null);
        } catch (error) {
            console.error('Failed to add sample', error);
            alert('Failed to add sample');
        }
    };

    if (userLoading || samplesLoading || isSubmitting) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container-modalAdd">
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
                <option value="" disabled>
                    Select a user
                </option>
                {userList && userList.length > 0 && userList.map((user: { id: string, name: string }, index: number) => (
                    <option key={index} value={user.id}>
                        {user.name}
                    </option>
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

            <div className="sections-container">
                <div>
                    <button className={"header-sample"}
                    >
                        Previous Sample
                    </button>
                    <div className={"line"}></div>
                    <div className="section-content">
                        <SearchbarComponentPrevSample/>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSubmit}
                style={{ marginTop: '20px' }}
                disabled={isSubmitting || isNameTaken || !nameInput.trim() || !selectedUser || !description.trim()}
            >
                Submit
            </button>
        </div>
    );
};

export default ModalSampleAdd;