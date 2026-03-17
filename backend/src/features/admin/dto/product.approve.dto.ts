import { IsBoolean, isNotEmpty, IsNotEmpty, IsUUID } from 'class-validator';

export class adminApproveProductDto {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;

    @IsBoolean()
    @IsNotEmpty()
    approve: boolean
}