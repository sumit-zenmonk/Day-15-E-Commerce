import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteSellerProduct, fetchSellerOrder, fetchSellerProducts, updateSellerProduct } from "./sellerAction";
import { SellerProductState, SellerProductType } from "./sellerType";

const initialState: SellerProductState = {
    products: [],
    orders: [],
    loading: false,
    error: null,
};

const sellerProductSlice = createSlice({
    name: "sellerProducts",
    initialState,
    reducers: {
        clearSellerProducts(state) {
            state.products = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchSellerProducts.fulfilled,
                (state, action: PayloadAction<SellerProductType[]>) => {
                    state.loading = false;

                    const newProducts = action.payload.filter(
                        (newProduct) =>
                            !state.products.some((p: SellerProductType) => p.uuid === newProduct.uuid)
                    );

                    state.products = [...state.products, ...newProducts];
                }
            )
            .addCase(fetchSellerProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteSellerProduct.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.products = state.products.filter((p) => p.uuid !== action.payload);
            })
            .addCase(deleteSellerProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateSellerProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSellerProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload;
                const index = state.products.findIndex((p) => p.uuid === updatedProduct.uuid);
                if (index !== -1) {
                    state.products[index] = updatedProduct;
                }
            })
            .addCase(updateSellerProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchSellerOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSellerOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data;
            })
            .addCase(fetchSellerOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearSellerProducts } = sellerProductSlice.actions;

export default sellerProductSlice.reducer;