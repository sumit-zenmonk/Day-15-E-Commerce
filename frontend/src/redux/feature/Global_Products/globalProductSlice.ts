import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalProductState, ProductType } from './globalProductType';
import { fetchGlobalProducts, updateApproveProducts } from './globalProductAction';

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
        filterProducts(state, action) {
            state.products = state.products.filter((p) => p.uuid !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGlobalProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGlobalProducts.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
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
            })
            .addCase(updateApproveProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateApproveProducts.fulfilled, (state, action) => {
                const { product_id, approve } = action.meta.arg;
                state.loading = false;
                const product = state.products.find(
                    (curr) => curr.uuid === product_id
                );

                if (product) {
                    product.is_admin_approved = approve;
                }
            })
            .addCase(updateApproveProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearProducts, filterProducts } = globalProductSlice.actions;
export default globalProductSlice.reducer;