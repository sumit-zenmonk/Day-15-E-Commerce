"use client"
import { usePathname, useRouter } from 'next/navigation';
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material"
import { logoutUser } from '@/redux/feature/Auth/authAction';
import './header-comp.css'
import { useState } from "react";
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import SearchProductComp from '../search-comp/search_comp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks.ts';
import { RootState } from '@/redux/store';
import { logoutItemSx, menuButtonSx, menuItemSx, menuPaperSx } from './header.styles';
import { clearProducts } from '@/redux/feature/Global_Products/globalProductSlice';

export default function HeaderComp() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, error, loading, status } = useAppSelector((state: RootState) => state.authReducer);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleLogOut = async () => {
        await dispatch(logoutUser()).unwrap();
        dispatch(clearProducts())
        localStorage.clear();
        router.replace("/login")
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box className="header">
            <Box className="left-container">
                <Image
                    src={'/flipkart.svg'}
                    className='logo'
                    alt='logo img'
                    width={40}
                    height={40}
                    onClick={() => router.replace('/')}
                />
            </Box>

            {/* <Box className="searchContainer" >
                <HomeFilledIcon fontSize='large' className='homeIcon' onClick={() => router.replace('/')} />
                <SearchProductComp />
            </Box> */}

            <Box className="right-container">
                <Button
                    variant="outlined"
                    sx={menuButtonSx}
                    onClick={handleMenuOpen}
                >
                    Menu
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    slotProps={{
                        paper: {
                            sx: menuPaperSx
                        }
                    }}
                >
                    {user ? [
                        user.role === 'SELLER' && (
                            <MenuItem
                                key="add"
                                sx={menuItemSx}
                                onClick={() => {
                                    router.push('/seller/product/add_product');
                                    handleMenuClose();
                                }}
                            >
                                Add Product
                            </MenuItem>
                        ),
                        user.role === 'SELLER' && (
                            <MenuItem
                                key="products"
                                onClick={() => {
                                    router.push('/seller/product/products');
                                    handleMenuClose();
                                }}
                                sx={menuItemSx}
                            >
                                My Products
                            </MenuItem>
                        ),
                        user.role === 'SELLER' && (
                            <MenuItem
                                key="order"
                                onClick={() => {
                                    router.push('/seller/order');
                                    handleMenuClose();
                                }}
                                sx={menuItemSx}
                            >
                                Orders
                            </MenuItem>
                        ),
                        user.role === 'USER' && (
                            <MenuItem
                                key="products"
                                onClick={() => {
                                    router.push(' /user/products');
                                    handleMenuClose();
                                }}
                                sx={menuItemSx}
                            >
                                Products
                            </MenuItem>
                        ),
                        user.role === 'USER' && (
                            <MenuItem
                                key="cart"
                                onClick={() => {
                                    router.push(' /user/cart');
                                    handleMenuClose();
                                }}
                                sx={menuItemSx}
                            >
                                Cart
                            </MenuItem>
                        ),
                        user.role === 'USER' && (
                            <MenuItem
                                key="order"
                                onClick={() => {
                                    router.push(' /user/order');
                                    handleMenuClose();
                                }}
                                sx={menuItemSx}
                            >
                                Orders
                            </MenuItem>
                        ),
                        <MenuItem
                            key="logout"
                            sx={logoutItemSx}
                            onClick={async () => {
                                await handleLogOut();
                                handleMenuClose();
                            }}
                        >
                            Log Out
                        </MenuItem>
                    ] : (
                        <MenuItem
                            onClick={() => {
                                router.push('/login');
                                handleMenuClose();
                            }}
                            sx={menuItemSx}
                        >
                            Sign In
                        </MenuItem>
                    )}
                </Menu>
            </Box>
        </Box >
    )
}
