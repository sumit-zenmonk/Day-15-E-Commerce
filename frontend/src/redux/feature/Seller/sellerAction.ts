import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { SellerProductType, UpdateSellerProductPayload } from "./sellerType";
import { OrderType } from "./sellerType";

interface FetchSellerProductsParams {
    limit?: number;
    offset?: number;
}

export const fetchSellerProducts = createAsyncThunk<
    SellerProductType[],
    FetchSellerProductsParams,
    { state: RootState }
>(
    "sellerProducts/fetchSellerProducts",
    async ({ limit = 5, offset = 0 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/product?limit=${limit}&offset=${offset}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok)
                return rejectWithValue(data.message || "Failed to fetch products");

            return data.data as SellerProductType[];
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteSellerProduct = createAsyncThunk<
    string,
    string,
    { state: RootState }
>(
    "sellerProducts/deleteSellerProduct",
    async (productId, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/product`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ product_id: productId }),
            });

            const data = await res.json();

            if (res.ok && data.message === "Product Deleted Success") {
                return productId;
            }

            return rejectWithValue(data.message || "Failed to delete product");
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateSellerProduct = createAsyncThunk<
    SellerProductType,
    UpdateSellerProductPayload,
    { state: RootState }
>(
    "sellerProducts/updateSellerProduct",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/product`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to update product");
            }

            return data.data as SellerProductType;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const fetchSellerOrder = createAsyncThunk<
    { data: OrderType[]; message: string },
    void,
    { state: RootState }
>(
    "userCommerce/fetchOrder",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/order`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Order failed");
            }

            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk<
    { message: string },
    { order_id: string, status: string },
    { state: RootState }
>(
    "sellerProducts/updateOrderStatus",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/order/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to update product");
            }
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateOrderStage = createAsyncThunk<
    { message: string },
    { order_id: string, stage: string },
    { state: RootState }
>(
    "sellerProducts/updateOrderStage",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/order/stage`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to update product");
            }
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);