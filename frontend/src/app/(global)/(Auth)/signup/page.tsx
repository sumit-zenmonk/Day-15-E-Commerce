"use client"

import styles from "./signup.module.css"
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

import { signupSchema, SignupSchemaType } from "@/types/signup"

import { signupUser } from "@/redux/feature/Auth/authAction"
import { RoleEnum } from "../../../../enums/role.enum"
import { RootState } from "@/redux/store"
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts"
import { useErrorHandler } from "@/utils/error"
import { enqueueSnackbar } from "notistack"

export default function SignupForm() {
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
    } = useForm<SignupSchemaType>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: RoleEnum.USER
        }
    })
    const role = watch("role")

    const onSubmit = async (data: SignupSchemaType) => {
        try {
            const payload = {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role
            };

            await dispatch(signupUser(payload)).unwrap();
            router.replace("/");
        } catch (error: any) {
            console.error("Signup failed:", error);
            handleError(error)
        }
    };

    return (
        <Box className={styles.container}>
            <Card className={styles.formWrapper} elevation={4}>
                <Typography variant="h5" className={styles.title}>
                    Create Account
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <Box className={styles.field}>
                        <InputLabel>
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
                    </Box>

                    <Box className={styles.field}>
                        <InputLabel>
                            Username
                        </InputLabel>

                        <TextField
                            fullWidth
                            {...register("username")}
                        // slotProps={{
                        //     input: { sx: { height: "40px", color: "white" } }
                        // }}
                        />

                        {errors.username && (
                            <span className={styles.error}>{errors.username.message}</span>
                        )}
                    </Box>

                    {/* EMAIL */}
                    <Box className={styles.field}>
                        <InputLabel>
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
                        <InputLabel>
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

                    <Box className={styles.field}>
                        <InputLabel>
                            Confirm Password
                        </InputLabel>

                        <TextField
                            type="password"
                            fullWidth
                            {...register("confirmPassword")}
                        // slotProps={{
                        //     input: { sx: { height: "40px", color: "white" } }
                        // }}
                        />

                        {errors.confirmPassword && (
                            <span className={styles.error}>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? "Creating Account..." : "Signup"}
                    </Button>

                    <Box className={styles.loginBox}>
                        <Typography>Already have an account?</Typography>

                        <Button onClick={() => router.replace("/login")}>
                            Login
                        </Button>
                    </Box>
                </form>
            </Card>
        </Box>
    )
}