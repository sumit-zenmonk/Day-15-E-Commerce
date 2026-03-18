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
import { useRouter } from "next/navigation";
import SliderComp from "@/component/slider-comp/slider-comp";

export default function SellerProductsPage() {
    const dispatch = useAppDispatch();
    const [isMounted, setIsMounted] = useState(false);
    const { products, error, loading } = useAppSelector((state: RootState) => state.SellerReducer);
    const router = useRouter();

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

    const handleUpdate = (id: string) => {
        router.push(`/seller/product/update?uid=${id}`);
    };

    if (!isMounted) return null;

    return (
        <Box className={styles.container}>
            {/* <Typography variant="h4" className={styles.title}>
                Your Product Listing
            </Typography> */}
            <SliderComp />

            <InfiniteScroll
                dataLength={products.length}
                next={fetchMoreProducts}
                hasMore={hasMore}
                className={styles.productGrid}
                loader={<Box className={styles.loading}><CircularProgress /></Box>}
                endMessage={<Typography className={styles.endMessage}>No more products</Typography>}
            >
                {products.map((product: SellerProductType) => (
                    <Card key={product.uuid} className={styles.card} elevation={3}>
                        <img src={product.product_img} alt={product.product_name} className={styles.image} />
                        <Box className={styles.info}>
                            <Typography variant="h6">{product.product_name}</Typography>
                            <Typography>Stock: {product.stock_quantity}</Typography>
                            <Typography color={product.is_admin_approved ? "green" : "orange"}>
                                {product.is_admin_approved ? "Approved" : "Pending Approval"}
                            </Typography>
                            <Box className={styles.actions}>
                                <Button
                                    className={styles.deleteBtn}
                                    disabled={loading}
                                    sx={DeleteProductSx}
                                    onClick={() => handleDelete(product.uuid)}
                                >
                                    Delete
                                </Button>

                                <Button
                                    className={styles.editBtn}
                                    disabled={loading}
                                    onClick={() => handleUpdate(product.uuid)}
                                >
                                    Edit
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                ))}
            </InfiniteScroll>
        </Box>
    );
}
