"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    Box,
    Button,
    Card,
    Typography,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import styles from "./update_product.module.css";
import { RootState } from "@/redux/store";
import { updateSellerProduct } from "@/redux/feature/Seller/sellerAction";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { UpdateProductFormType } from "@/types/seller";

export default function UpdateProductPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const { products } = useAppSelector(
        (state: RootState) => state.SellerReducer
    );
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<UpdateProductFormType>();

    useEffect(() => {
        if (!uid) return;
        const product = products.find((p: any) => p.uuid === uid);
        if (product) {
            setValue("product_name", product.product_name);
            setValue("stock_quantity", product.stock_quantity);
            setValue("price", (product as any).price || 0);
            setImageUrl(product.product_img);
        }
    }, [uid, products, setValue]);


    const handleImageUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("imageUrl", file);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `${token}`,
                    },
                    body: formData,
                }
            );
            const data = await res.json();
            if (!res.ok) {
                (data.errors || [data.message] || ["Upload failed"]).forEach(
                    (msg: string) =>
                        enqueueSnackbar(msg, { variant: "error" })
                );
            } else {
                const img = data.image_urls[0].path || data.image_urls[0];
                setImageUrl(img);
                enqueueSnackbar("Image uploaded!", { variant: "success", });
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || "Upload error", { variant: "error", });
        } finally {
            setUploading(false);
        }
    };


    const onSubmit: SubmitHandler<UpdateProductFormType> = async (data) => {
        if (!uid) return;
        if (!imageUrl) {
            enqueueSnackbar("Please upload an image", {
                variant: "warning",
            });
            return;
        }
        setLoading(true);
        try {
            await dispatch(
                updateSellerProduct({
                    product_id: uid,
                    product_name: data.product_name,
                    stock_quantity: Number(data.stock_quantity),
                    price: Number(data.price),
                    product_img: imageUrl,
                })
            ).unwrap();
            enqueueSnackbar("Product Updated Successfully", {
                variant: "success",
            });
            router.push("/seller/product/products");
        } catch (err: any) {
            enqueueSnackbar(err || "Update failed", { variant: "error", });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={styles.container}>
            <Card className={styles.card} elevation={4}>
                <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
                    Update Product
                </Typography>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.form}
                >
                    <Box className={styles.field}>
                        <InputLabel>Product Name</InputLabel>
                        <input
                            type="text"
                            {...register("product_name", {
                                required: "Product name Required",
                            })}
                            className={styles.input}
                        />
                        {errors.product_name && (
                            <span className={styles.error}>
                                {errors.product_name.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel>Stock Quantity</InputLabel>
                        <input
                            type="number"
                            {...register("stock_quantity", {
                                required: "Stock Quantity Required",
                                min: 0,
                            })}
                            className={styles.input}
                        />
                        {errors.stock_quantity && (
                            <span className={styles.error}>
                                {errors.stock_quantity.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel>Price</InputLabel>
                        <input
                            type="number"
                            {...register("price", {
                                required: "Product price Required",
                                min: 0,
                            })}
                            className={styles.input}
                        />
                        {errors.price && (
                            <span className={styles.error}>
                                {errors.price.message}
                            </span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel>Upload Image</InputLabel>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                e.target.files &&
                                handleImageUpload(e.target.files[0])
                            }
                            className={styles.input}
                        />
                        {uploading && <CircularProgress size={24} />}
                        {imageUrl && (
                            <Typography className={styles.uploadedText}>
                                Current Image: {imageUrl}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        disabled={loading || uploading}
                        className={styles.submitButton}
                        variant="contained"
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </Button>
                </form>
            </Card>
        </Box>
    );
}