import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {

    @IsArray()
    cart_ids: string[];

    @IsString()
    address: string;

    @IsNumber()
    total_price: number;
}