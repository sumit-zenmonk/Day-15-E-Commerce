import { ORDER_STAGE, ORDER_STATUS } from "src/enums/order";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid" })
    user_uuid: string;

    @Column({ type: "varchar" })
    product_id: string;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "varchar" })
    address: string;

    @Column({
        type: 'enum',
        enum: ORDER_STATUS,
        default: ORDER_STATUS.INPROCESS,
    })
    order_status: ORDER_STATUS;

    @Column({
        type: 'enum',
        enum: ORDER_STAGE,
        default: ORDER_STAGE.ONBOARD,
    })
    order_stage: ORDER_STAGE;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
