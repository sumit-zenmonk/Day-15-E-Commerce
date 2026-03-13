import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CartUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    cart_id: string;

    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @IsNumber()
    @Min(0)
    quantity: number;
}
