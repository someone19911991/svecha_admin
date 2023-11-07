import apiSlice from '../api/apiSlice'
import { IProduct } from '../../interfaces'

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getProducts: build.query<IProduct[], string>({
            query: (param) => ({
                url: `/product/${param}`,
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            providesTags: (result) => ['Product'],
        }),
        getProduct: build.query<IProduct, string>({
            query: (param) => ({
                url: `/product/${param}`,
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.message || 'Something went wrong!'
            },
            providesTags: (result) => ['Product'],
        }),
        getTopSellingProducts: build.query<IProduct[], void>({
            query: (param) => ({
                url: `/product/top-sellers`,
            }),
        }),
        createProduct: build.mutation<string, FormData>({
            query: (body) => ({
                url: `/product/${body.get('category_name')}/${
                    body.get('product_id') || ''
                }`,
                method: body.get('product_id') ? 'PATCH' : 'POST',
                body,
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.message || 'Something went wrong!'
            },
            invalidatesTags: ['Product'],
        }),
        deleteProduct: build.mutation<
            string,
            { category_name: string; product_id: number }
        >({
            query: (body) => ({
                url: `/product/${body.category_name}/${body.product_id}`,
                method: 'DELETE',
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.message || 'Something went wrong!'
            },
            invalidatesTags: ['Product'],
        }),
        deleteRef: build.mutation<
            string,
            { refs: Array<string>, product_id: number }
        >({
            query: (body) => ({
                url: `/product/refs/${body.product_id}`,
                method: 'DELETE',
                body
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.message || 'Something went wrong!'
            },
            invalidatesTags: ['Product'],
        }),
        deleteOem: build.mutation<
            string,
            { oems: Array<string>; product_id: number }
        >({
            query: (body) => ({
                url: `/product/oems/${body.product_id}`,
                method: 'DELETE',
                body
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.message || 'Something went wrong!'
            },
            invalidatesTags: ['Product'],
        }),
        deleteImg: build.mutation<string, { img: string; product_id: number }>({
            query: (body) => ({
                url: `/product/imgs/${body.product_id}/${body.img}`,
                method: 'DELETE',
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.message || 'Something went wrong!'
            },
            invalidatesTags: ['Product'],
        }),
    }),
})

export const {
    useLazyGetProductsQuery,
    useGetProductsQuery,
    useGetProductQuery,
    useLazyGetProductQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useDeleteImgMutation,
    useDeleteRefMutation,
    useDeleteOemMutation,
    useGetTopSellingProductsQuery
} = productsApiSlice
