"use client";

import { Box, Typography, Button, IconButton, Modal, TextField } from "@mui/material";
import { RootState } from "@/redux/store";
import styles from "./cart.module.css";
import { CartItemType } from "@/redux/feature/User/userType";
import { createOrder, removeFromCart, updateCart, createAddress } from "@/redux/feature/User/userAction";
import { enqueueSnackbar } from "notistack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { useForm } from "react-hook-form";
import { formatAddress } from "@/utils/format_address";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, addressSchemaType } from "@/types/address.form";

export default function CartPage() {
    const dispatch = useAppDispatch();
    const { cart, loading } = useAppSelector(
        (state: RootState) => state.UserCommerceReducer
    );
    const addresses = useAppSelector(
        (state: RootState) => state.authReducer.user?.address
    );
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<addressSchemaType>({
        resolver: zodResolver(addressSchema),
    });
    const [isMounted, setIsMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [showNewForm, setShowNewForm] = useState(false);

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
        quantity: number,
        stock: number
    ) => {
        try {
            if (quantity > stock) {
                enqueueSnackbar("Quantity exceeds available stock", { variant: "error" });
                return;
            }

            await dispatch(updateCart({ cart_id, product_id, quantity })).unwrap();
            enqueueSnackbar("Cart updated", { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err || "Update failed", { variant: "error" });
        }
    };

    const handleCreateAddress = async (data: any) => {
        try {
            const res = await dispatch(
                createAddress({ ...data, is_default: false })
            ).unwrap();

            setSelectedAddress(res.uuid);
            setShowNewForm(false);
            reset();

            enqueueSnackbar("Address added", { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err || "Failed", { variant: "error" });
        }
    };

    useEffect(() => {
        if (!showNewForm) {
            const def = addresses?.find((a: any) => a.is_default);
            if (def) setSelectedAddress(def.uuid);
        } else {
            setSelectedAddress("");
        }
    }, [showNewForm, addresses]);

    const handleOrder = async () => {
        try {
            if (showNewForm) {
                enqueueSnackbar("Please save the new address before placing order", { variant: "warning" });
                return;
            }

            const selected = addresses?.find((a: any) => a.uuid === selectedAddress);
            if (!selected) {
                enqueueSnackbar("Select address", { variant: "warning" });
                return;
            }

            const formattedAddress = formatAddress(selected);
            const cart_ids = cart.map((item) => item.uuid);

            await dispatch(
                createOrder({
                    cart_ids,
                    address: formattedAddress,
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
                        <img src={item.product.product_img} className={styles.productImg} />

                        <Box className={styles.productInfo}>
                            <Typography>{item.product.product_name}</Typography>
                            <Typography>Qty: {item.quantity}</Typography>
                            <Typography>${item.product.price * item.quantity}</Typography>
                        </Box>

                        <IconButton onClick={() => handleDelete(item.uuid)} color="error">
                            <DeleteOutlineIcon />
                        </IconButton>

                        <Box>
                            <Button onClick={() => handleQuantityChange(item.uuid, item.product_id, item.quantity - 1, item.product.stock_quantity)} disabled={item.quantity <= 1}>-</Button>
                            {item.quantity}
                            <Button onClick={() => handleQuantityChange(item.uuid, item.product_id, item.quantity + 1, item.product.stock_quantity)}>+</Button>
                        </Box>
                    </Box>
                ))}

                <Typography>Total: ${totalAmount}</Typography>

                <Button disabled={!cart.length} onClick={() => setOpen(true)}>
                    Checkout
                </Button>
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box className={styles.modalBox}>
                    <Typography variant="h6">Select Address</Typography>

                    <Button onClick={() => setShowNewForm(!showNewForm)}>
                        {!showNewForm ? "Add New Address" : "Choose"}
                    </Button>
                    {!showNewForm &&
                        <Box>
                            {addresses?.map((addr: any) => (
                                <Box key={addr.uuid} className={styles.modalAddressOption} onClick={() => setSelectedAddress(addr.uuid)}>
                                    <Box>
                                        <input
                                            type="radio"
                                            checked={selectedAddress === addr.uuid}
                                            onChange={() => setSelectedAddress(addr.uuid)}
                                        />
                                        <span>{formatAddress(addr)}</span>
                                    </Box>
                                    {addr.is_default &&
                                        <Typography> default</Typography>}
                                </Box>
                            ))}

                            <Button
                                variant="contained"
                                fullWidth
                                className={styles.buyBtn}
                                onClick={handleOrder}
                            >
                                Place Order
                            </Button>
                        </Box>
                    }
                    {showNewForm && (
                        <form onSubmit={handleSubmit(handleCreateAddress)} className={styles.modalForm}>
                            <TextField label="Street" {...register("street_address")} fullWidth />
                            <TextField label="Apartment" {...register("apartment_suite")} fullWidth />
                            <TextField label="City" {...register("city")} fullWidth />
                            <TextField label="State" {...register("state_province")} fullWidth />
                            <TextField label="Postal Code" {...register("postal_code")} fullWidth />
                            <TextField label="Country" {...register("country")} fullWidth />

                            <Button type="submit" variant="contained">
                                Save Address
                            </Button>
                        </form>
                    )}
                </Box>
            </Modal>
        </Box>
    );
}