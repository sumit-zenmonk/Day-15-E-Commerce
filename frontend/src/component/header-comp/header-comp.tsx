"use client"
import { usePathname, useRouter } from 'next/navigation';
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material"
import { logoutUser } from '@/redux/feature/Auth/authAction';
import './header-comp.css'
import { useState } from "react";
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import SearchMusicComp from '../search-comp/search_comp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks.ts';
import { RootState } from '@/redux/store';
import { logoutItemSx, menuButtonSx, menuItemSx, menuPaperSx } from './header.styles';

export default function HeaderComp() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, error, loading, status } = useAppSelector((state: RootState) => state.authReducer);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleLogOut = async () => {
        await dispatch(logoutUser()).unwrap();
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
                    src={'/logo.png'}
                    className='logo'
                    alt='logo img'
                    width={40}
                    height={40}
                    onClick={() => router.replace('/')}
                />
            </Box>

            <Box className="right-container">
                <Box className="searchContainer" >
                    <HomeFilledIcon fontSize='large' className='homeIcon' onClick={() => router.replace('/')} />
                    <SearchMusicComp />
                </Box>

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
                    <MenuItem
                        onClick={() => {
                            router.push('/');
                            handleMenuClose();
                        }}
                        sx={menuItemSx}
                    >
                        Home
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            router.push('/profile');
                            handleMenuClose();
                        }}
                        sx={menuItemSx}
                    >
                        Profile
                    </MenuItem>

                    {user ? (
                        <>
                            {user ? (
                                <MenuItem
                                    sx={menuItemSx}
                                    onClick={async () => {
                                        router.push('/add_product');
                                    }}
                                >
                                    Add Product
                                </MenuItem>
                            ) : <></>}

                            <MenuItem
                                sx={logoutItemSx}
                                onClick={async () => {
                                    await handleLogOut();
                                    handleMenuClose();
                                }}
                            >
                                Log Out
                            </MenuItem>
                        </>
                    ) : (
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