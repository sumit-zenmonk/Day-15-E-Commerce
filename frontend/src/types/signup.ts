import { Role } from "@/app/(global)/(Auth)/role.enum";
import { z } from "zod";

export const signupSchema = z.object({
    role: z.nativeEnum(Role),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export type SignupSchemaType = z.infer<typeof signupSchema>;