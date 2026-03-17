import { z } from "zod";

export const addressSchema = z.object({
    street_address: z.string().min(1, "Street is required"),
    apartment_suite: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state_province: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
});

export type addressSchemaType = z.infer<typeof addressSchema>