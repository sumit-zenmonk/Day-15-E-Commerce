import { z } from "zod";

export const orderSchema = z.object({
    cart_ids: z.array(z.string()).min(1, "At least one item is required"),
    address: z.string().min(5, "Please provide a complete address"),
    total_price: z.number().positive("Total price must be greater than 0"),
});

export type OrderSchemaType = z.infer<typeof orderSchema>;

export const orderAddressSchema = z.object({
    address: z.string().min(5, "Please provide a complete address"),
});

export type OrderAddressSchemaType = z.infer<typeof orderAddressSchema>;