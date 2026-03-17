import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ORDER_STATUS } from 'src/enums/order';

export class OrderUpdateStatusDto {
    @IsUUID()
    @IsNotEmpty()
    order_id: string;

    @IsEnum(ORDER_STATUS)
    @IsNotEmpty()
    status: ORDER_STATUS
}

