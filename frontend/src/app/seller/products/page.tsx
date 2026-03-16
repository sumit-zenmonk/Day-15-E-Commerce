"use client";

import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box, Card, Typography, CircularProgress, Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import styles from "./products.module.css";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { fetchSellerProducts, deleteSellerProduct } from "@/redux/feature/Seller/sellerAction";
import { SellerProductType } from "@/redux/feature/Seller/sellerType";
import { ProductType } from "@/redux/feature/Global_Products/globalProductType";
import { DeleteProductSx } from "./products.styles";
import { filterProducts } from "@/redux/feature/Global_Products/globalProductSlice";

export default function SellerProductsPage() {
    const dispatch = useAppDispatch();
    const [isMounted, setIsMounted] = useState(false);
    const { products, error, loading } = useAppSelector((state: RootState) => state.SellerReducer);

    const [limit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fetchMoreProducts = async () => {
        try {
            const result: SellerProductType[] = await dispatch(
                fetchSellerProducts({ limit, offset })
            ).unwrap();

            setOffset((prev) => prev + limit);
            if (result.length < limit) setHasMore(false);
        } catch (err: any) {
            enqueueSnackbar(err || "Failed to load products", { variant: "error" });
        }
    };

    useEffect(() => {
        if (!isMounted) return;
        fetchMoreProducts();
    }, [isMounted]);

    const handleDelete = async (id: string) => {
        try {
            const result = await dispatch(deleteSellerProduct(id)).unwrap();
            dispatch(filterProducts(id));
            if (result) {
                enqueueSnackbar("Product Deleted Success", { variant: "success" });
            }
        } catch (err: any) {
            enqueueSnackbar(err || "Delete failed", { variant: "error" });
        }
    };

    if (!isMounted) return null;

    return (
        <Box className={styles.container}>
            <Typography variant="h4" className={styles.title}>
                Your Product Listing
            </Typography>

            <InfiniteScroll
                dataLength={products.length}
                next={fetchMoreProducts}
                hasMore={hasMore}
                loader={<Box className={styles.loading}><CircularProgress /></Box>}
                endMessage={<Typography className={styles.endMessage}>No more products</Typography>}
            >
                <Box className={styles.productGrid}>
                    {products.map((product: SellerProductType) => (
                        <Card key={product.uuid} className={styles.card} elevation={3}>
                            <img src={product.product_img} alt={product.product_name} className={styles.image} />
                            <Box className={styles.info}>
                                <Typography variant="h6">{product.product_name}</Typography>
                                <Typography>Stock: {product.stock_quantity}</Typography>
                                <Typography color={product.is_admin_approved ? "green" : "orange"}>
                                    {product.is_admin_approved ? "Approved" : "Pending Approval"}
                                </Typography>
                                <Button
                                    disabled={loading}
                                    sx={DeleteProductSx}
                                    onClick={() => handleDelete(product.uuid)}
                                >
                                    Delete Product
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Box>
            </InfiniteScroll>
        </Box>
    );
}
