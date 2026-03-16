"use client"

import HeaderComp from "@/component/header-comp/header-comp";
import { Box } from "@mui/material";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <Box>
            <HeaderComp />
            {children}
        </Box>
    );
}
