"use client"
import { Box, InputAdornment, MenuItem, Select, TextField } from "@mui/material"
import { useState } from "react"
import styles from "./search_comp.module.css";
import SearchIcon from '@mui/icons-material/Search';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { enqueueSnackbar } from "notistack";

export default function SearchProductComp() {
    const [currProduct, setCurrProduct] = useState<string>();

    const handleProductSearch = () => {
        enqueueSnackbar(currProduct, { variant: "info" });
    }

    return (
        < Box className={styles.search_box} >
            {/* Search Bar */}
            <SearchIcon />
            <TextField
                fullWidth
                // label="Search Product"
                placeholder="Search Product"
                // variant="outlined"
                // value={name}
                onKeyDown={(e) => e.key === 'Enter' && handleProductSearch()}
                onChange={(e) => setCurrProduct(e.target.value)}
                sx={{
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                        border: "transparent",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "transparent",
                    },
                }}
            />
            <TravelExploreIcon />
        </Box >
    )
}