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

                <Box className="optionBox">
                    <Box className="optionlist">
                        <Typography className='option'>Premium </Typography>
                        <Typography className='option'>Support </Typography>
                        <Typography className='option'>Download </Typography>
                    </Box>
                    <Box className="optionlist">
                        <Typography className='option'>Install App <FileDownloadIcon /></Typography>
                        <Typography className='option'>Sign Up </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    sx={{ width: "10%", height: "10%", color: "black", backgroundColor: "white", fontWeight: "700", fontSize: "1rem", borderRadius: "16px" }}
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
                            sx: {
                                width: "10%",
                                backgroundColor: "rgb(29, 29, 29)",
                                color: "rgba(255, 255, 255, 0.98)",
                                fontWeight: "900",
                                borderRadius: "20px",
                                textAlign: "center",
                            }
                        }
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            router.push('/');
                            handleMenuClose();
                        }}
                        sx={{
                            fontWeight: "700",
                            border: "2px solid transparent",
                            borderRadius: "20px",
                            '&:hover': {
                                border: "2px solid white"
                            },
                        }}
                    >
                        Home
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            router.push('/profile');
                            handleMenuClose();
                        }}
                        sx={{
                            fontWeight: "700",
                            border: "2px solid transparent",
                            borderRadius: "20px",
                            '&:hover': {
                                border: "2px solid white"
                            },
                        }}
                    >
                        Profile
                    </MenuItem>

                    {user ? (
                        <MenuItem
                            sx={{
                                color: "red",
                                fontWeight: "700",
                                border: "2px solid transparent",
                                borderRadius: "20px",
                                '&:hover': {
                                    border: "2px solid white"
                                },
                            }}
                            onClick={async () => {
                                await handleLogOut();
                                handleMenuClose();
                            }}
                        >
                            Log Out
                        </MenuItem>
                    ) : (
                        <MenuItem
                            onClick={() => {
                                router.push('/login');
                                handleMenuClose();
                            }}
                            sx={{
                                fontWeight: "700",
                                border: "2px solid transparent",
                                borderRadius: "20px",
                                '&:hover': {
                                    border: "2px solid white"
                                },
                            }}
                        >
                            Sign In
                        </MenuItem>
                    )}
                </Menu>
            </Box>
        </Box >
    )
}
