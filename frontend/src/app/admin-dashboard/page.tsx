"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import { RootState } from "@/redux/store";
import { fetchGlobalProducts, updateApproveProducts } from "@/redux/feature/Global_Products/globalProductAction";
import styles from "./admin-dashboard.module.css";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import HeaderComp from "@/component/header-comp/header-comp";

export default function AdminDashboard() {
    const dispatch = useAppDispatch();
    const { products, loading } = useAppSelector(
        (state: RootState) => state.globalProductsReducer
    );
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        dispatch(fetchGlobalProducts({ limit: rowsPerPage, offset: page * rowsPerPage }));
    }, [page]);

    const handleApprove = async (product_id: string, approve: boolean) => {
        try {
            dispatch(updateApproveProducts({ product_id, approve }));
            enqueueSnackbar(`Product ${approve ? "Approved" : "DisApproved"}`, { variant: "success" });
        } catch (err) {
            enqueueSnackbar(`Failed to ${approve ? "Approved" : "DisApproved"}`, { variant: "error" });
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <Box className={styles.container}>
            <HeaderComp />
            {loading && products.length === 0 ? (
                <Box className={styles.loader}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography>
                        Admin Dashboard
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Approved</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.uuid}>
                                    <TableCell>{product.product_name}</TableCell>
                                    <TableCell>{product.stock_quantity}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>
                                        {product.is_admin_approved}
                                        {product.is_admin_approved ? "Yes" : "No"}
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => handleApprove(product.uuid, !product.is_admin_approved)}
                                        >
                                            {!product.is_admin_approved ? "Approve" : "DisApprove"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                        component="div"
                        count={100}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[10]}
                    />
                </>
            )}
        </Box>
    );
}