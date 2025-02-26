// features/apt/aptApiSlice.ts
import { apiSlice } from '../../services/apiSlice';
import { APTModel, APTModelResponse, CreateAPTInput, UpdateAPTInput, APTMutationResponse } from './aptInterfaces';

export const aptApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Fetch all APTs (assuming paginated response)
        getAPTs: builder.query<APTModelResponse, void>({
            query: () => 'apt/',
        }),

        // Fetch a specific APT by ID
        getAPTById: builder.query<APTModel, number>({
            query: (id: number) => `apt/${id}/`,
        }),

        // Create a new APT
        createAPT: builder.mutation<APTMutationResponse, CreateAPTInput>({
            query: (newAPT: CreateAPTInput) => ({
                url: 'apt/',
                method: 'POST',
                body: newAPT,
            }),
        }),

        // Update an existing APT
        updateAPT: builder.mutation<APTMutationResponse, UpdateAPTInput>({
            query: ({ id, ...updatedAPT }: UpdateAPTInput) => ({
                url: `apt/${id}/`,
                method: 'PUT',
                body: updatedAPT,
            }),
        }),

        // Delete an APT by ID
        deleteAPT: builder.mutation<void, number>({
            query: (id: number) => ({
                url: `apt/${id}/`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAPTsQuery,
    useGetAPTByIdQuery,
    useCreateAPTMutation,
    useUpdateAPTMutation,
    useDeleteAPTMutation,
} = aptApiSlice;
