import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { AddCartPayloadType, AddToCartResponse, CartItemType } from "./userType";

export const addToCart = createAsyncThunk<
    AddToCartResponse,
    AddCartPayloadType,
    { state: RootState }
>(
    "userCommerce/addToCart",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to add cart");
            }
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchCart = createAsyncThunk<
    CartItemType[],
    void,
    { state: RootState }
>(
    "userCommerce/fetchCart",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/cart`, {
                headers: {
                    Authorization: token,
                },
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to fetch cart");
            }
            return data.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const removeFromCart = createAsyncThunk<
    { cart_id: string; message: string },
    string,
    { state: RootState }
>(
    "userCommerce/removeFromCart",
    async (cart_id, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/cart`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({ cart_id }),
            });
            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to delete item");
            }
            return { cart_id, message: data.message };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateCart = createAsyncThunk<
    { cartProduct: CartItemType; message: string },
    { cart_id: string; product_id: string; quantity: number },
    { state: RootState }
>(
    "userCommerce/updateCart",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/cart`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to update cart");
            }

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);