'use client';

import React, { useState, useEffect } from 'react';
import "./styles/Modal-Experiment.css";
import { useMethodListQuery, useSEMAddMutation, useDetailSampleQuery } from "@/redux/features/sampleApiSlice";
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEMForm from '@/components/AddSample/SEM';

interface SEMInfo {
    method: string;
    created_at: string;
    image: string | null;
    description: string;
    magnification: number;
    voltage: number;
    current: number;
    sample: number;
    file: string[];
}

const ModalExperiment: React.FC = () => {
    const params = useParams();
    const sampleName = params?.name;
    const { data: sampleDetail, isLoading: isSampleLoading, isError: isSampleError } = useDetailSampleQuery(sampleName || '');
    const sampleId = sampleDetail?.sample_id;
    // @ts-ignore
    const { data: methods, isLoading, isError } = useMethodListQuery();
    const [addSEM, { isLoading: isSubmitting, isError: isSubmitError, isSuccess }] = useSEMAddMutation();

    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [semInfo, setSEMInfo] = useState<SEMInfo>({
        method: 'SEM',
        created_at: new Date().toISOString(),
        image: null,
        description: '',
        magnification: 0,
        voltage: 0,
        current: 0,
        sample: 0,
        file: [],
    });

    useEffect(() => {
        if (sampleId) {
            setSEMInfo((prev) => ({
                ...prev,
                sample: sampleId,
            }));
        }
    }, [sampleId]);

    const handleSubmit = async () => {
        if (!semInfo.sample || semInfo.sample === 0) {
            console.error("Invalid Sample ID:", semInfo.sample);
            alert("Invalid Sample ID. Please select a valid sample.");
            return;
        }

        console.log("Submitting SEM Info:", semInfo);
        try {
            await addSEM(semInfo).unwrap();
            alert('SEM info added successfully!');
        } catch (error) {
            console.error('Failed to add SEM info:', error);
            alert('Error submitting SEM info. Please try again.');
        }
    };

    const handleMethodClick = (method: string) => {
        setSelectedMethod(method);
        setSEMInfo((prev) => ({
            ...prev,
            method: method.toUpperCase(),
        }));
    };

    if (isLoading || isSampleLoading) {
        return <div>Loading...</div>;
    }

    if (isError || isSampleError) {
        console.error("Error fetching methods or sample details.");
        return (
            <div>
                <p>Error fetching methods or sample details.</p>
                {isError && <p>Failed to fetch methods.</p>}
                {isSampleError && <p>Failed to fetch sample details.</p>}
            </div>
        );
    }

    const handleFormSubmission = () => {
        // Do something after the form is successfully submitted,
        // e.g., refresh data, show a success message, etc.
        console.log("Form submitted successfully!");
    };

    return (
        <Tabs defaultValue="tab-1" orientation="vertical" className="w-full flex-row">
            <TabsList className="flex-col gap-1 bg-transparent py-0">
                <TabsTrigger
                    value="tab-1"
                    className="data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none"
                >
                    SEM
                </TabsTrigger>
                <TabsTrigger
                    value="tab-2"
                    className="data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none"
                >
                    Projects
                </TabsTrigger>
                <TabsTrigger
                    value="tab-3"
                    className="data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none"
                >
                    Packages
                </TabsTrigger>
                <TabsTrigger
                    value="tab-4"
                    className="data-[state=active]:bg-muted w-full justify-start data-[state=active]:shadow-none"
                >
                    bite
                </TabsTrigger>


            </TabsList>
            <div className="grow rounded-md border text-start">
                <TabsContent value="tab-1">
                    <SEMForm onFormSubmit={handleFormSubmission} />
                </TabsContent>
                <TabsContent value="tab-2">
                    <p className="text-muted-foreground px-4 py-3 text-xs">Content for Tab 2</p>
                </TabsContent>
                <TabsContent value="tab-3">
                    <p className="text-muted-foreground px-4 py-3 text-xs">Content for Tab 3</p>
                </TabsContent>
                <TabsContent value="tab-4">
                    <p className="text-muted-foreground px-4 py-3 text-xs">Content for Tab 4</p>
                </TabsContent>
            </div>
        </Tabs>
    );
};

export default ModalExperiment;