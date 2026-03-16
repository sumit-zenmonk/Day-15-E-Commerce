import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { SellerProductType } from "./sellerType";

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
                `http://localhost:9000/seller/product?limit=${limit}&offset=${offset}`,
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
            const res = await fetch(`http://localhost:9000/seller/product`, {
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