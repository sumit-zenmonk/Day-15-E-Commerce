import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "./product.entity";

@Entity('order_item')
export class OrderItemEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid" })
    order_id: string;

    @Column({ type: "uuid" })
    product_id: string;

    @Column({ type: "int" })
    price: number;

    @Column({ type: "int" })
    quantity: number;

    @ManyToOne(() => OrderEntity, order => order.items)
    @JoinColumn({ name: "order_id" })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, product => product.order_items)
    @JoinColumn({ name: "product_id" })
    product: ProductEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}