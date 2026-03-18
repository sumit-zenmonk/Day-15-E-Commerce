"use client";

import { useEffect, useState } from "react";
import { Box, Card, Typography, CircularProgress, Button } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { enqueueSnackbar } from "notistack";
import styles from "./products.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { fetchGlobalProducts } from "@/redux/feature/Global_Products/globalProductAction";
import FooterComp from "@/component/footer-comp/footer";
import { ProductType } from "@/redux/feature/Global_Products/globalProductType";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { addToCart, fetchCart } from "@/redux/feature/User/userAction";
import { CartItemType } from "@/redux/feature/User/userType";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useRouter } from "next/navigation";
import SliderComp from "@/component/slider-comp/slider-comp";

export default function UserHomePage() {
    const dispatch = useAppDispatch();
    const { products, loading, error } = useAppSelector(
        (state: RootState) => state.globalProductsReducer
    );
    const cartProducts = useAppSelector((state: RootState) => state.UserCommerceReducer.cart);

    const router = useRouter();
    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        setIsMounted(true);
        const fetchOldCart = async () => {
            await dispatch(fetchCart());
        }
        fetchOldCart();
    }, []);

    const fetchMoreProducts = async () => {
        try {
            const result: ProductType[] = await dispatch(fetchGlobalProducts({ limit, offset })).unwrap();

            setOffset((prev) => prev + limit);

            if (result.length === 0) {
                setHasMore(false);
            }
        } catch (err: any) {
            enqueueSnackbar(err || "Failed to load products", { variant: "error" });
        }
    };

    useEffect(() => {
        if (!isMounted) return;
        fetchMoreProducts();
    }, [isMounted]);

    const handleAddtoCart = async (id: string) => {
        try {
            const product = products.find(p => p.uuid === id);
            const qty = quantities[id] || 1;

            if (product && qty > product.stock_quantity) {
                enqueueSnackbar("Quantity exceeds available stock", { variant: "error" });
                return;
            }
            const result = await dispatch(
                addToCart({
                    product_id: id,
                    quantity: qty,
                })
            ).unwrap();

            enqueueSnackbar(result.message, { variant: "success" });
        } catch (err: any) {
            enqueueSnackbar(err || "Failed to add products", { variant: "error" });
        }
    };

    const increaseQty = (id: string, stock: number) => {
        setQuantities((prev) => {
            const currentQty = prev[id] || 1;

            if (currentQty >= stock) {
                return prev;
            }

            if (currentQty + 1 >= stock) {
                enqueueSnackbar("Quantity exceeds available stock", { variant: "error" });
            }

            return {
                ...prev,
                [id]: currentQty + 1,
            };
        });
    };

    const decreaseQty = (id: string) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 1) - 1, 1),
        }));
    };
    if (!isMounted) return null;

    return (
        <Box className={styles.container}>
            <SliderComp />
            <Box className={styles.productContainer}>
                {error && (
                    <Typography color="error" className={styles.error}>
                        {error}
                    </Typography>
                )}

                <InfiniteScroll
                    dataLength={products.length}
                    next={fetchMoreProducts}
                    hasMore={hasMore}
                    className={styles.productGrid}
                    loader={
                        <Box className={styles.loading}>
                            <CircularProgress />
                        </Box>
                    }
                    endMessage={
                        <Typography className={styles.endMessage}>
                            No more products to show
                        </Typography>
                    }
                >
                    {products.map((product) => (
                        <Card key={product.uuid} className={styles.productCard} elevation={3}>
                            <img
                                src={product.product_img || "/play_store.png"}
                                alt={product.product_name}
                                className={styles.productImage}
                            />
                            <Box className={styles.productInfo}>
                                <Typography variant="h6">{product.product_name}</Typography>
                                <Typography>Stock: {product.stock_quantity}</Typography>
                                <Typography>Price: {product.price}</Typography>
                                <Typography>
                                    Approved: {product.is_admin_approved ? "Yes" : "No"}
                                </Typography>
                            </Box>
                            {!cartProducts.some((prod: CartItemType) => prod.product_id === product.uuid) ? (
                                <Box className={styles.cartActions}>
                                    <Box className={styles.cartActions}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => decreaseQty(product.uuid)}
                                        >
                                            -
                                        </Button>

                                        <Typography>
                                            {quantities[product.uuid] || 1}
                                        </Typography>

                                        <Button
                                            variant="outlined"
                                            onClick={() => increaseQty(product.uuid, product.stock_quantity)}
                                            disabled={(quantities[product.uuid] || 1) >= product.stock_quantity}
                                        >
                                            +
                                        </Button>
                                    </Box>

                                    <Button
                                        className={styles.Addbtn}
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => handleAddtoCart(product.uuid)}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            ) : (
                                <Button
                                    variant="contained"
                                    startIcon={<ShoppingCartCheckoutIcon />}
                                    onClick={() => router.push('/user/cart')}
                                >
                                    Active Cart Product
                                </Button>
                            )}
                        </Card>
                    ))}
                </InfiniteScroll>
            </Box>

            <FooterComp />
        </Box>
    );
}