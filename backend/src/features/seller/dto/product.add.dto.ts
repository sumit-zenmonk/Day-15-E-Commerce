import { IsString, IsNotEmpty, IsNumber, IsUrl, IsUUID, Min } from 'class-validator';

export class ProductAddDto {
    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsNumber()
    @Min(0)
    stock_quantity: number;

    @IsString()
    @IsNotEmpty()
    product_img: string;
}
