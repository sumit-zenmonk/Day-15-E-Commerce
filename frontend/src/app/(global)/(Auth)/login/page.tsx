"use client"

import styles from "./login.module.css"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    Box,
    Button,
    Card,
    TextField,
    Typography,
    InputLabel,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material"

import { loginSchema, LoginSchemaType } from "@/types/login"
import { loginUser } from "@/redux/feature/Auth/authAction"
import { RoleEnum } from "../../../../enums/role.enum"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import { RootState } from "@/redux/store"
import { useErrorHandler } from "@/utils/error"

export default function LoginForm() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { handleError } = useErrorHandler();
    const loading = useAppSelector((state: RootState) => state.authReducer.loading)
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        // defaultValues: {
        //     role: RoleEnum.USER
        // }
    })
    // const role = watch("role")

    const onSubmit = async (data: LoginSchemaType) => {
        try {
            await dispatch(loginUser(data)).unwrap()
            router.replace("/")
        } catch (error) {
            console.error("Login failed:", error)
            handleError(error)
        }
    }

    return (
        <Box className={styles.container}>
            <Card className={styles.formWrapper} elevation={4}>
                <Typography variant="h5" className={styles.title}>
                    Welcome Back
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    {/* <Box className={styles.field}>
                        <InputLabel sx={{ color: "white", fontSize: ".8rem" }}>
                            Select Role
                        </InputLabel>

                        <ToggleButtonGroup
                            value={role}
                            exclusive
                            fullWidth
                            onChange={(_, value) => {
                                if (value) setValue("role", value)
                            }}
                        >
                            <ToggleButton value={RoleEnum.USER}>User</ToggleButton>
                            <ToggleButton value={RoleEnum.SELLER}>Seller</ToggleButton>
                        </ToggleButtonGroup>
                    </Box> */}

                    <Box className={styles.field}>
                        <InputLabel >
                            Email
                        </InputLabel>

                        <TextField
                            type="email"
                            fullWidth
                            {...register("email")}
                        // slotProps={{
                        //     input: { sx: { height: "40px", color: "white" } }
                        // }}
                        />

                        {errors.email && (
                            <span className={styles.error}>{errors.email.message}</span>
                        )}
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel >
                            Password
                        </InputLabel>

                        <TextField
                            type="password"
                            fullWidth
                            {...register("password")}
                        // slotProps={{
                        //     input: { sx: { height: "40px", color: "white" } }
                        // }}
                        />

                        {errors.password && (
                            <span className={styles.error}>{errors.password.message}</span>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        className={styles.loginbutton}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>

                    <Box className={styles.signupBox}>
                        <Typography>Don't have an account?</Typography>

                        <Button onClick={() => router.replace("/signup")}>
                            Sign Up
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    )
}