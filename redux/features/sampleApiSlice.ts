import { apiSlice } from '../services/apiSlice';


const sampleApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchSampleModelByName: builder.query({
            query: (name) => `samples/description/${name}/`,
        }),
        User: builder.query({
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

        }),
        UserMachine:builder.query({
            query: () => `samples/user-machine/`,

        }),
        UserMachineMe:builder.query({
            query: (id) => `samples/user-machine/me`,

        }),
        SampleAdd:builder.mutation({
            query: (data) => ({
                url : "samples/init/",
                method : "post",
                body : data
            }),
        }),
    }),
});

export const {
    useFetchSampleModelByNameQuery,
    useUserQuery,
    useDetailSampleQuery,
    useSemDetailQuery,
    useSubstrateSampleQuery,
    useUserMachineQuery,
    useUserMachineMeQuery,
    useSampleAddMutation
} = sampleApiSlice;
