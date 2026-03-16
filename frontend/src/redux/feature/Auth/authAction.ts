"use client"

import { createAsyncThunk } from "@reduxjs/toolkit"
import { AuthResponse, LoginPayload, SignupPayload } from "./authtype"

const API = process.env.NEXT_PUBLIC_BACKEND_URL

export const signupUser = createAsyncThunk<
    AuthResponse,
    SignupPayload,
    { rejectValue: string }
>("auth/signup", async (payload: any, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message)
        }

        return data
    } catch (error: any) {
        return rejectWithValue(error.message)
    }
})

export const loginUser = createAsyncThunk<
    AuthResponse,
    LoginPayload,
    { rejectValue: string }
>("auth/login", async (payload: any, { rejectWithValue }) => {
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

        const data = await res.json()

        if (!res.ok) {
            return rejectWithValue(data.message)
        }

        return data
    } catch (error: any) {
        return rejectWithValue(error.message)
    }
})

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    return null
})