"use client";

import { Box, Typography, Button, IconButton, Modal, TextField } from "@mui/material";
import { RootState } from "@/redux/store";
import styles from "./cart.module.css";
import { CartItemType } from "@/redux/feature/User/userType";
import { createOrder, removeFromCart, updateCart } from "@/redux/feature/User/userAction";
import { enqueueSnackbar } from "notistack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderAddressSchema, OrderAddressSchemaType, orderSchema, OrderSchemaType } from "@/types/order";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector(
        (state: RootState) => state.UserCommerceReducer
    );
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<OrderAddressSchemaType>({
        resolver: zodResolver(orderAddressSchema),
    });

    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const address = watch("address");

    const totalAmount = cart.reduce(
        (acc: number, item: any) => acc + item.product.price * item.quantity,
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
            enqueueSnackbar(err || "Update failed", { variant: "error" });
        }
    };

    const onSubmit = async (data: OrderAddressSchemaType) => {
        try {
            const cart_ids = cart.map((item) => item.uuid);

            await dispatch(
                createOrder({
                    cart_ids,
                    address: data.address,
                    total_price: totalAmount,
                })
            ).unwrap();

            enqueueSnackbar("Order placed successfully", { variant: "success" });
            setOpen(false);
        } catch (err: any) {
            enqueueSnackbar(err || "Order failed", { variant: "error" });
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Box className={styles.container}>
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
                        variant="outlined"
                        className={styles.buyBtn}
                        disabled={cart.length === 0}
                        onClick={() => setOpen(true)}
                    >
                        Checkout
                    </Button>
                </Box>
            </Box>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        width: "40%",
                        backgroundColor: "white",
                        padding: "3%",
                        margin: "8% auto",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >
                    <Typography variant="h6">Checkout</Typography>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            width: "100%"
                        }}
                    >
                        <TextField
                            label="Shipping Address"
                            fullWidth
                            {...register("address")}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />

                        <Typography>
                            Total: ${totalAmount}
                        </Typography>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{ width: "100%" }}
                        >
                            Place Order
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    );
}