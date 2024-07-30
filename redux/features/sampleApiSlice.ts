import { apiSlice } from '../services/apiSlice';

const sampleApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchSampleModelByName: builder.query({
            query: (name) => `samples/description/${name}/`,
        }),
        UserMachine: builder.query({
            query: () => `samples/user/`,
        }),
        DetailSample:builder.query({
            query: (name) => `samples/detail/${name}/`,
        })
    }),
});

export const {
    useFetchSampleModelByNameQuery,
    useUserMachineQuery,
    useDetailSampleQuery
} = sampleApiSlice;
