"use client"

import { createSlice } from "@reduxjs/toolkit"
import Cookies from "js-cookie"
import { signupUser, loginUser, logoutUser } from "./authAction"
import { AuthState } from "./authtype"

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    status: "pending"
}

const decodeToken = (token: string) => {
    const payload = JSON.parse(atob(token.split(".")[1]))

    return {
        uid: payload.uuid,
        email: payload.email,
        name: payload.username,
        role: payload.role
    }
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.user = null
            state.token = null
            state.loading = false
            state.error = null
            state.status = "pending"

            Cookies.remove("token")
            Cookies.remove("role")
        },

        resetAuthError: (state) => {
            state.error = null
            state.status = "pending"
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })

            .addCase(signupUser.fulfilled, (state, action) => {
                const token = action.payload.access_token
                const user = decodeToken(token)

                state.loading = false
                state.status = "succeed"
                state.user = user
                state.token = token

                Cookies.set("token", token)
                Cookies.set("role", user.role)
            })

            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true
                state.status = "pending"
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                const token = action.payload.access_token
                const user = decodeToken(token)

                state.loading = false
                state.status = "succeed"
                state.user = user
                state.token = token

                Cookies.set("token", token)
                Cookies.set("role", user.role)
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.status = "rejected"
                state.error = action.payload as string
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null
                state.token = null
                state.status = "pending"

                Cookies.remove("token")
                Cookies.remove("role")
            })
    }
})

export const { resetAuth, resetAuthError } = authSlice.actions
export default authSlice.reducer