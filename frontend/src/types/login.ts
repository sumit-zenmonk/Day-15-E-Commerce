import { RoleEnum } from "@/enums/role.enum"
import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    // role: z.nativeEnum(RoleEnum)
})

export type LoginSchemaType = z.infer<typeof loginSchema>