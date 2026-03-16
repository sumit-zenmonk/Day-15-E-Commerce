"use client";

import { useEffect, useState } from "react";
import { Box, Card, Typography, CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { enqueueSnackbar } from "notistack";
import styles from "./home.module.css";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import { fetchGlobalProducts } from "@/redux/feature/Global_Products/globalProductAction";
import FooterComp from "@/component/footer-comp/footer";
import { ProductType } from "@/redux/feature/Global_Products/globalProductType";
import HeaderComp from "@/component/header-comp/header-comp";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state: RootState) => state.globalProductsReducer
  );

  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchMoreProducts = async () => {
    try {
      const result: ProductType[] = await dispatch(fetchGlobalProducts({ limit, offset })).unwrap();

      setOffset((prev) => prev + limit);

      if (result.length < limit) {
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

  if (!isMounted) return null;

  return (
    <Box className={styles.container}>
      <HeaderComp />

      <Box className={styles.productContainer}>
        <Typography variant="h4" className={styles.title}>
          Product Listing
        </Typography>

        {error && (
          <Typography color="error" className={styles.error}>
            {error}
          </Typography>
        )}

        <InfiniteScroll
          dataLength={products.length}
          next={fetchMoreProducts}
          hasMore={hasMore}
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
          <Box className={styles.productGrid}>
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
                  <Typography>
                    Approved: {product.is_admin_approved ? "Yes" : "No"}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </InfiniteScroll>
      </Box>

      <FooterComp />
    </Box>
  );
}