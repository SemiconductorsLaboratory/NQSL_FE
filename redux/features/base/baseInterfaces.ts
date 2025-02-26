
export interface BaseExperiment {
    user: number | null; // Assuming user is an ID, otherwise you can define the UserMachineModel type
    machine: number | null; // Assuming machine is an ID, otherwise you can define the Machine type
    created_at: string; // ISO date string
    path: string | null;
    description: string | null;
    sample: number; // Assuming sample is an ID, otherwise you can define the SampleModel type
}