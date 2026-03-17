import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { ProductType } from './globalProductType';

interface FetchProductsParams {
    limit?: number;
    offset?: number;
}

export const fetchGlobalProducts = createAsyncThunk<ProductType[], FetchProductsParams, { state: RootState }>(
    'products/fetchGlobalProducts',
    async ({ limit = 10, offset = 0 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || '';
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products?limit=${limit}&offset=${offset}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch products');

            return data.data as ProductType[];
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateApproveProducts = createAsyncThunk<
    { message: string },
    { product_id: string, approve: boolean },
    { state: RootState }
>(
    "sellerProducts/updateApproveProducts",
    async (payload, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || "";

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/approve_product`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                return rejectWithValue(data.message || "Failed to update product approval");
            }
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);