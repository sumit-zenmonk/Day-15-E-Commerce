import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ORDER_STAGE } from 'src/enums/order';

export class OrderUpdateStageDto {
    @IsUUID()
    @IsNotEmpty()
    order_id: string;

    @IsEnum(ORDER_STAGE)
    @IsNotEmpty()
    stage: ORDER_STAGE
}

