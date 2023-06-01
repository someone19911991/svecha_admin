import apiSlice from "../api/apiSlice"
import {IAuth} from "../../interfaces";

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        signIn: build.mutation<IAuth, {email: string, password: string}>({
            query: (body) => ({
                url: '/auth/sign-in',
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
        }),
        refresh: build.mutation<IAuth, void>({
            query: () => ({
                url: '/auth/refresh',
                method: 'post',
            }),
        }),
        logout: build.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: 'post'
            })
        })
    })
})

export const {useSignInMutation, useRefreshMutation, useLogoutMutation} = authApiSlice