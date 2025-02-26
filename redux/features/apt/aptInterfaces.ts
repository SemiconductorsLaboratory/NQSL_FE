import {BaseExperiment} from "@/redux/features/base/baseInterfaces";

export interface APTModel extends BaseExperiment {
    method: 'voltage' | 'laser'; // or expand with other options if you add more
}

export interface APTModelResponse {
    data: APTModel[];
    // count: number; // if you implement pagination or count of total items
}

export interface CreateAPTInput {
    user?: number | null;
    machine?: number | null;
    path?: string | null;
    description?: string | null;
    sample: number; // Required field
    method: 'voltage' | 'laser'; // Ensure it matches your STATUS_CHOICES
}

export interface UpdateAPTInput extends CreateAPTInput {
    id: number; // Include the ID for updates
}

export type APTMutationResponse = APTModel;
