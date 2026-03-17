import { createSlice } from "@reduxjs/toolkit";
import { UserCommerceState } from "./userType";
import { addToCart, createAddress, createOrder, fetchCart, fetchOrder, removeFromCart, updateCart } from "./userAction";

const initialState: UserCommerceState = {
    cart: [],
    orders: [],
    loading: false,
    error: null,
    message: null,
};

const userSlice = createSlice({
    name: "userCommerce",
    initialState,
    reducers: {
        clearUserMessage(state) {
            state.message = null;
        },
        clearUserError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const { cartProduct, message } = action.payload;
                const existingIndex = state.cart.findIndex(
                    (item) => item.product_id === cartProduct.product_id
                );
                if (existingIndex !== -1) {
                    state.cart[existingIndex] = cartProduct;
                } else {
                    state.cart.push(cartProduct);
                }
                state.loading = false;
                state.message = message;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = state.cart.filter(item => item.uuid !== action.payload.cart_id);
                state.message = action.payload.message;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                const { cartProduct, message } = action.payload;
                const index = state.cart.findIndex(
                    item => item.uuid === cartProduct.uuid
                );
                if (index !== -1) {
                    state.cart[index] = cartProduct;
                }
                state.loading = false;
                state.message = message;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = [];
                state.message = action.payload.message;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.data;
                state.message = action.payload.message;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearUserMessage, clearUserError } = userSlice.actions;

export default userSlice.reducer;