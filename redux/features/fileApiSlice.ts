import { apiSlice } from '../services/apiSlice';

const sampleApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        RetrieveFile: builder.query({
            query: (url) => `${url}`,
        }),
    }),
});

export const {
    useRetrieveFileQuery,
} = sampleApiSlice;
