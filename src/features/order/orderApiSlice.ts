import apiSlice from '../api/apiSlice'
import { IOrderedProduct, IPhoneCount, IMessage } from '../../interfaces'

const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getNotifications: build.query<{ phoneCount: Array<IPhoneCount>, orderedProducts: Array<IOrderedProduct> }, string>({
            query: (param) => ({
                url: param,
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
        getMessages: build.query<Array<IMessage>, string>({
            query: (param) => ({
                url: param,
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
        sold: build.mutation<void, {status: string, items: Array<string> }>({
            query: (body) => ({
                url: `/order/sold`,
                method: 'POST',
                body
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            invalidatesTags: ['Order'],
        }),
        accepted: build.mutation<void, {status: string, items: Array<string> }>({
            query: (body) => ({
                url: `/order/accepted`,
                method: 'POST',
                body
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            invalidatesTags: ['Order'],
        }),
        getAnalytic: build.mutation<Array<{sum: number, count: number, category: string}>, {dateFrom: string, dateTo: string}>({
            query: (body) => ({
                url: `/order/analytic`,
                method: 'POST',
                body
            }),
            transformErrorResponse: (
                response: { status: string | number; data?: any },
                meta,
                arg
            ) => {
                return response?.data?.error || 'Something went wrong!'
            },
            invalidatesTags: ['Order'],
        }),
    }),
})

export const {
    useGetNotificationsQuery,
    useSoldMutation,
    useAcceptedMutation,
    useGetMessagesQuery,
    useGetAnalyticMutation
} = ordersApiSlice
