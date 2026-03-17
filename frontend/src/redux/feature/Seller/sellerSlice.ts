import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteSellerProduct, fetchSellerOrder, fetchSellerProducts, updateOrderStage, updateOrderStatus, updateSellerProduct } from "./sellerAction";
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
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;

                const { order_id, status } = action.meta.arg;

                const index = state.orders.findIndex((o) => o.uuid === order_id);

                if (index !== -1) {
                    state.orders[index].order_status = status;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateOrderStage.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateOrderStage.fulfilled, (state, action) => {
                state.loading = false;

                const { order_id, stage } = action.meta.arg;

                const index = state.orders.findIndex((o) => o.uuid === order_id);

                if (index !== -1) {
                    state.orders[index].order_stage = stage;
                }
            })
            .addCase(updateOrderStage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearSellerProducts } = sellerProductSlice.actions;

export default sellerProductSlice.reducer;