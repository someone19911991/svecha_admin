import apiSlice from "../api/apiSlice";
import {IAuth, IOrderedProduct, IPhoneCount} from "../../interfaces";

const modelApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getModels: build.query<Array<{img: string, name: string, id: number}>, void>({
            query: () => ({
                url: `models`,
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            providesTags: (result) => ['Model'],
        }),
        getModelsByName: build.query<Array<any>, string>({
            query: (param) => ({
                url: `models/${param}`,
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            providesTags: (result) => ['Order'],
        }),
        createModel: build.mutation<string, FormData>({
            query: (body) => ({
                url: '/models',
                method: 'post',
                body
            }),
            transformErrorResponse: (
                response: { status: string | number, data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            invalidatesTags: ['Model'],
        }),
        updateModel: build.mutation<string, FormData>({
            query: (body) => ({
                url: '/models',
                method: 'PATCH',
                body
            }),
            transformErrorResponse: (
                response: { status: string | number, data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            invalidatesTags: ['Model'],
        }),
        deleteModel: build.mutation<string, { id: string }>({
            query: (body) => ({
                url: `/models/${body.id}`,
                method: 'DELETE',
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.message || 'Something went wrong!'
            },
            invalidatesTags: ['Model'],
        }),
    })
})

export const {useCreateModelMutation, useUpdateModelMutation, useGetModelsQuery, useGetModelsByNameQuery, useDeleteModelMutation} = modelApiSlice