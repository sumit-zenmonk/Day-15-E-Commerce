import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CartDeleteDto {
    @IsUUID()
    @IsNotEmpty()
    cart_id: string;
}
