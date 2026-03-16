import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalProductState, Product } from './globalProductType';
import { fetchGlobalProducts } from './globalProductAction';

const initialState: GlobalProductState = {
    products: [],
    loading: false,
    error: null,
};

const globalProductSlice = createSlice({
    name: 'globalProducts',
    initialState,
    reducers: {
        clearProducts(state) {
            state.products = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGlobalProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGlobalProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.loading = false;
                const newProducts = action.payload.filter(
                    (newProduct) =>
                        !state.products.some((existing) => existing.uuid === newProduct.uuid)
                );
                state.products = [...state.products, ...newProducts];
            })
            .addCase(fetchGlobalProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProducts } = globalProductSlice.actions;
export default globalProductSlice.reducer;