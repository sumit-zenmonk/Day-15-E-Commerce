"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Box, Button, Card, Typography, InputLabel, CircularProgress } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { useAppSelector } from "@/redux/hooks.ts";
import { RootState } from "@/redux/store";
import styles from "./add_product.module.css";
import { ProductFormType } from "@/types/add_product";

export default function UploadProduct() {
    const router = useRouter();
    const token = useAppSelector((state: RootState) => state.authReducer.token);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormType>();

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);

        const formData = new FormData();
        formData.append("imageUrl", file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload/image`, {
                method: "POST",
                headers: { Authorization: `${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                (data.errors || [data.message] || ["Failed to upload image"]).forEach((msg: string) =>
                    enqueueSnackbar(msg, { variant: "error" })
                );
            } else {
                setImageUrl(data.image_urls[0].path || data.image_urls[0]);
                enqueueSnackbar("Image uploaded!", { variant: "success" });
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || "Upload error", { variant: "error" });
        } finally {
            setUploading(false);
        }
    };

    const onSubmit: SubmitHandler<ProductFormType> = async (data) => {
        if (!imageUrl) {
            enqueueSnackbar("Please upload an image first", { variant: "warning" });
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...data,
                stock_quantity: Number(data.stock_quantity),
                price: Number(data.price),
                product_img: imageUrl,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/product`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) {
                (result.errors || [result.message] || ["Failed"]).forEach((msg: string) =>
                    enqueueSnackbar(msg, { variant: "error" })
                );
            } else {
                enqueueSnackbar("Product created successfully!", { variant: "success" });
                reset();
                setImageUrl(null);
                router.push("/");
            }
        } catch (err: any) {
            enqueueSnackbar(err.message || "Error", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={styles.container}>
            <Card className={styles.card} elevation={4}>
                <Typography variant="h5" sx={{ marginBottom: "1rem" }}>Upload Product</Typography>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Box className={styles.field}>
                        <InputLabel>Product Name</InputLabel>
                        <input type="text" {...register("product_name", { required: "Required" })} className={styles.input} />
                        {errors.product_name && <span className={styles.error}>{errors.product_name.message}</span>}
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel>Stock Quantity</InputLabel>
                        <input type="number" {...register("stock_quantity", { required: "Required", min: 0 })} className={styles.input} />
                        {errors.stock_quantity && <span className={styles.error}>{errors.stock_quantity.message}</span>}
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel>Price</InputLabel>
                        <input type="number" {...register("price", { required: "Required", min: 0 })} className={styles.input} />
                        {errors.price && <span className={styles.error}>{errors.price.message}</span>}
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel>Upload Image</InputLabel>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} className={styles.input} />
                        {uploading && <CircularProgress size={24} />}
                        {imageUrl && <Typography className={styles.uploadedText}>Uploaded: {imageUrl}</Typography>}
                    </Box>

                    <Button type="submit" disabled={loading || uploading} className={styles.submitButton} variant="contained">
                        {loading ? "Uploading..." : "Create Product"}
                    </Button>
                </form>
            </Card>
        </Box>
    );
}