import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userInfoAftreLogin } from './types'
export const api = createApi({
    reducerPath: "server-api",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.BACKEND_URL,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        getUser: builder.mutation<userInfoAftreLogin, string>({
            query() {
                return {
                    url: "/api/v1/success",
                    method: "GET",
                    credentials: "include",
                    responseHandler(response) {
                        return response.json()
                    },
                }
            },

        }),
        logout:builder.mutation<string, string>({
            query() {
                return {
                    url: "/api/v1/logout",
                    method: "POST",
                    credentials: "include",
                    responseHandler(response) {
                        return response.text()
                    },
                }
            },

        }),
        deleteAccount:builder.mutation<string, string>({
            query() {
                return {
                    url: "/api/v1/delete",
                    method: "DELETE",
                    credentials: "include",
                    responseHandler(response) {
                        return response.text()
                    },
                }
            },

        })
    }),
})
export const { useGetUserMutation,useLogoutMutation,useDeleteAccountMutation } = api