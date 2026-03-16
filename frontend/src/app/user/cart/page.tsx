"use client";

import { Box, Typography, Button, IconButton } from "@mui/material";
import { RootState } from "@/redux/store";
import styles from "./cart.module.css";
import { CartItemType } from "@/redux/feature/User/userType";
import { removeFromCart, updateCart } from "@/redux/feature/User/userAction";
import { enqueueSnackbar } from "notistack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import HeaderComp from "@/component/header-comp/header-comp";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector(
        (state: RootState) => state.UserCommerceReducer
    );

    const [isMounted, setIsMounted] = useState(false);

    const totalAmount = cart.reduce(
        (acc: any, item: any) => acc + item.product.price * item.quantity,
        0
    );

    const handleDelete = async (id: string) => {
        try {
            await dispatch(removeFromCart(id)).unwrap();
            enqueueSnackbar("Item removed", { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err || "Delete failed", { variant: "error" });
        }
    };

    const handleQuantityChange = async (
        cart_id: string,
        product_id: string,
        quantity: number
    ) => {
        try {
            await dispatch(updateCart({ cart_id, product_id, quantity })).unwrap();

            enqueueSnackbar("Cart updated", { variant: "success" });
        } catch (err: any) {
            console.log(err, cart_id, product_id, quantity);
            enqueueSnackbar(err || "Update failed", { variant: "error" });
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Box className={styles.container}>
            <HeaderComp />

            <Typography className={styles.title}>
                My Cart ({cart.length})
            </Typography>

            <Box className={styles.cartWrapper}>
                {cart.map((item: CartItemType) => (
                    <Box key={item.uuid} className={styles.cartCard}>
                        <img
                            src={item.product.product_img}
                            className={styles.productImg}
                        />

                        <Box className={styles.productInfo}>
                            <Typography className={styles.productName}>
                                {item.product.product_name}
                            </Typography>

                            <Typography className={styles.productQty}>
                                Quantity: {item.quantity}
                            </Typography>

                            <Typography className={styles.productPrice}>
                                ${item.product.price * item.quantity}
                            </Typography>
                        </Box>

                        <Box className={styles.deleteBtn}>
                            <IconButton
                                onClick={() => handleDelete(item.uuid)}
                                disabled={loading}
                                color="error"
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Box>

                        <Box className={styles.quantityWrapper}>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                    handleQuantityChange(
                                        item.uuid,
                                        item.product_id,
                                        item.quantity - 1
                                    )
                                }
                                disabled={item.quantity <= 1}
                            >
                                -
                            </Button>

                            <Typography>{item.quantity}</Typography>

                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                    handleQuantityChange(
                                        item.uuid,
                                        item.product_id,
                                        item.quantity + 1
                                    )
                                }
                            >
                                +
                            </Button>
                        </Box>
                    </Box>
                ))}

                <Box className={styles.summaryBox}>
                    <Typography className={styles.totalText}>
                        Total: ${totalAmount}
                    </Typography>

                    <Button
                        variant="contained"
                        className={styles.buyBtn}
                        disabled={cart.length === 0}
                    >
                        Checkout
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}