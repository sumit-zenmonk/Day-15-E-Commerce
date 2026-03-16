import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteSellerProduct, fetchSellerProducts } from "./sellerAction";
import { SellerProductState, SellerProductType } from "./sellerType";

const initialState: SellerProductState = {
    products: [],
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


    },
});

export const { clearSellerProducts } = sellerProductSlice.actions;

export default sellerProductSlice.reducer;