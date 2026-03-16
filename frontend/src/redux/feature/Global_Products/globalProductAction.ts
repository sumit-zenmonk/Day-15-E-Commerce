import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { Product } from './globalProductType';

interface FetchProductsParams {
    limit?: number;
    offset?: number;
}

export const fetchGlobalProducts = createAsyncThunk<Product[], FetchProductsParams, { state: RootState }>(
    'products/fetchGlobalProducts',
    async ({ limit = 10, offset = 0 }, { getState, rejectWithValue }) => {
        try {
            const token = getState().authReducer.token || '';
            const res = await fetch(`http://localhost:9000/products?limit=${limit}&offset=${offset}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch products');

            return data.data as Product[];
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);