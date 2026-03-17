"use client"

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../feature/Auth/authSlice";
import globalProductsReducer from "../feature/Global_Products/globalProductSlice";
import SellerReducer from "../feature/Seller/sellerSlice";
import UserCommerceReducer from "../feature/User/userSlice";

const persistConfig = {
    key: "root",
    storage,
    blacklisted: [globalProductsReducer]
};

const appReducer = combineReducers({
    authReducer: authReducer,
    globalProductsReducer: globalProductsReducer,
    SellerReducer: SellerReducer,
    UserCommerceReducer: UserCommerceReducer
});

const rootReducer = (state: any, action: any) => {
    if (action.type.includes("auth/logout/fulfilled")) {
        storage.removeItem("persist:root");
        state = undefined;
    }
    return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
