import { IsString, IsNotEmpty, IsNumber, IsUrl, IsUUID, Min } from 'class-validator';

export class ProductDeleteDto {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;
}
