import { ORDER_STAGE, ORDER_STATUS } from "src/enums/order";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItemEntity } from "./order.item.entity";
import { UserEntity } from "./user.entity";

@Entity('order')
export class OrderEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid" })
    user_uuid: string;

    @Column({ type: "uuid" })
    product_id: string;

    @Column({ type: "int" })
    total_price: number;

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

    @OneToMany(() => OrderItemEntity, item => item.order)
    items: OrderItemEntity[];

    @ManyToOne(() => UserEntity, user => user.orders)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
