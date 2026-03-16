"use client";

import { Box, Card, Typography } from "@mui/material";
import styles from "./order.module.css";
import { useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { RoleEnum } from "@/enums/role.enum";
import { OrderUserType } from "@/redux/feature/Seller/sellerType";

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
    order_status: string;
    total_price: number;
    items: Item[];
    user: OrderUserType;
};

type Props = {
    orders: Order[];
};

export default function OrderList({ orders }: Props) {
    const userRole = useAppSelector((state: RootState) => state.authReducer.user?.role);

    if (!orders || orders.length === 0) {
        return (
            <Box className={styles.emptyContainer}>
                <Typography className={styles.emptyText}>
                    No orders exist right now
                </Typography>
            </Box>
        );
    }

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