"use client";

import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { fetchSellerOrder } from "@/redux/feature/Seller/sellerAction";
import OrderList from "@/component/order-comp/order_comp";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

export default function SellerOrders() {
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector(
        (state: RootState) => state.SellerReducer
    );
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        dispatch(fetchSellerOrder());
    }, [dispatch]);

    if (!isMounted) return null;

    if (loading && orders.length === 0) {
        return (<CircularProgress />);
    }

    return <OrderList orders={orders} />;
}