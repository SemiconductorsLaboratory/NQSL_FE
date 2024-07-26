import { apiSlice } from '../services/apiSlice';

const sampleApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchSampleModelByName: builder.query({
            query: (name) => `samples/name/${name}/`,
        }),
    }),
});

export const {
    useFetchSampleModelByNameQuery,
} = sampleApiSlice;
