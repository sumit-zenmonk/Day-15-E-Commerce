"use client"

import styles from "./logout.module.css"
import { logoutUser } from "@/redux/feature/Auth/authAction"
import { clearProducts } from "@/redux/feature/Global_Products/globalProductSlice";
import { useAppDispatch } from "@/redux/hooks.ts"
import { useRouter } from "next/navigation";

export default function LogoutComp() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logoutUser())
        dispatch(clearProducts())
        router.replace('/login');
    }

    return (
        <div className={styles.container}>
            <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}