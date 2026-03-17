"use client";

import { Box, Button, Card, Typography } from "@mui/material";
import styles from "./order.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { RoleEnum } from "@/enums/role.enum";
import { OrderUserType } from "@/redux/feature/Seller/sellerType";
import OrderStepper from "../order-stepper/order_stepper_comp";
import { ORDER_STAGE, ORDER_STATUS } from "@/enums/order.enum";
import { useState } from "react";
import { updateOrderStage, updateOrderStatus } from "@/redux/feature/Seller/sellerAction";

type Product = {
    product_name: string;
    product_img: string;
};

type Item = {
    uuid: string;
    quantity: number;
    price: number;
    product: Product;
};

type Order = {
    uuid: string;
    total_price: number;
    address: string;
    order_status: string;
    order_stage: string;
    items: Item[];
    user?: OrderUserType;
    created_at: string;
};

type Props = {
    orders: Order[];
};

export default function OrderList({ orders }: Props) {
    const userRole = useAppSelector((state: RootState) => state.authReducer.user?.role);
    const dispatch = useAppDispatch();
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    if (!orders || orders.length === 0) {
        return (
            <Box className={styles.emptyContainer}>
                <Typography className={styles.emptyText}>
                    No orders exist right now
                </Typography>
            </Box>
        );
    }

    const handleStageChange = async (order_id: string, stage: ORDER_STAGE) => {
        try {
            setLoadingMap((prev) => ({ ...prev, [order_id]: true }));

            await dispatch(updateOrderStage({ order_id, stage })).unwrap();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMap((prev) => ({ ...prev, [order_id]: false }));
        }
    };

    const handleStatusChange = async (order_id: string, status: ORDER_STATUS) => {
        try {
            setLoadingMap((prev) => ({ ...prev, [order_id]: true }));

            await dispatch(updateOrderStatus({ order_id, status })).unwrap();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMap((prev) => ({ ...prev, [order_id]: false }));
        }
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.productContainer}>
                {orders.map((order) => (
                    <Box key={order.uuid} className={styles.orderBox}>

                        <Box className={styles.orderHeader}>
                            <Typography>
                                Order ID: {order.uuid.slice(0, 8)}
                            </Typography>

                            <Typography>
                                Status: {order.order_status}
                            </Typography>

                            <Typography>
                                ₹{order.total_price}
                            </Typography>
                        </Box>
                        {
                            userRole === RoleEnum.SELLER
                            &&
                            order.order_status == ORDER_STATUS.INPROCESS
                            &&
                            <>
                                <Button
                                    disabled={loadingMap[order.uuid]}
                                    onClick={() => handleStatusChange(order.uuid, ORDER_STATUS.ACCEPTED)}
                                >
                                    {loadingMap[order.uuid] ? "Please wait..." : "Accept Order"}
                                </Button>

                                <Button
                                    disabled={loadingMap[order.uuid]}
                                    onClick={() => handleStatusChange(order.uuid, ORDER_STATUS.REJECTED)}
                                >
                                    {loadingMap[order.uuid] ? "Please wait..." : "Reject Order"}
                                </Button>
                            </>
                        }
                        {
                            order.order_status == ORDER_STATUS.ACCEPTED
                            &&
                            <OrderStepper
                                stage={order.order_stage as ORDER_STAGE}
                                role={userRole as RoleEnum}
                                onChange={(nextStage) => handleStageChange(order.uuid, nextStage)}
                                loading={loadingMap[order.uuid]}
                            />
                        }
                        {
                            order.order_status == ORDER_STATUS.REJECTED
                            &&
                            'Rejected order'
                        }
                        {
                            order.user &&
                            userRole === RoleEnum.SELLER && (
                                <>{order.user.email}{order.user.username}</>
                            )
                        }
                        <Box className={styles.productGrid}>
                            {order.items.map((item) => (
                                <Card
                                    key={item.uuid}
                                    className={styles.productCard}
                                    elevation={3}
                                >
                                    <img
                                        src={item.product.product_img || "/play_store.png"}
                                        alt={item.product.product_name}
                                        className={styles.productImage}
                                    />

                                    <Box className={styles.productInfo}>
                                        <Typography>
                                            {item.product.product_name}
                                        </Typography>

                                        <Typography>
                                            Qty: {item.quantity}
                                        </Typography>

                                        <Typography>
                                            ₹{item.price}
                                        </Typography>
                                    </Box>
                                </Card>
                            ))}
                        </Box>

                    </Box>
                ))}
            </Box>
        </Box>
    );
}