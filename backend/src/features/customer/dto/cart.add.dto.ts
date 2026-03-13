import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CartAddDto {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @IsNumber()
    @Min(0)
    quantity: number;
}
