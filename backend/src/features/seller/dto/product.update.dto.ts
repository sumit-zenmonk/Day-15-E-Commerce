import { IsString, IsNotEmpty, IsNumber, IsUUID, Min, IsOptional } from 'class-validator';

export class ProductUpdateDto {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    product_name?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock_quantity?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    product_img?: string;

    @IsOptional()
    @IsNumber()
    price: number;
}