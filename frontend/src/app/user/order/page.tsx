"use client";

import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchOrder } from "@/redux/feature/User/userAction";
import { RootState } from "@/redux/store";
import OrderList from "@/component/order-comp/order_comp";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

export default function UserOrders() {
    const dispatch = useAppDispatch();
    const { orders, loading } = useAppSelector(
        (state: RootState) => state.UserCommerceReducer
    );
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        dispatch(fetchOrder());
    }, [dispatch]);

    if (!isMounted) return null;

    if (loading) {
        return (<CircularProgress />);
    }

    return <OrderList orders={orders} />;
}