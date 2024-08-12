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
        }),
        SubstrateSample:builder.query({
            query: (name) => `samples/substrate/${name}/`,
        }),
        SemDetail:builder.query({
            query: (id) => `samples/sem/${id}`,
        })
    }),
});

export const {
    useFetchSampleModelByNameQuery,
    useUserMachineQuery,
    useDetailSampleQuery,
    useSemDetailQuery,
    useSubstrateSampleQuery,
} = sampleApiSlice;
