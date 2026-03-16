import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderItemEntity } from "./order.item.entity";
import { CartEntity } from "./cart.entity";
import { UserEntity } from "./user.entity";

@Entity('product')
export class ProductEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid" })
    seller_uuid: string;

    @Column({ type: "varchar" })
    product_name: string;

    @Column({ type: "int" })
    stock_quantity: number;

    @Column({ type: "varchar" })
    product_img: string;

    @Column({ type: "int" })
    price: number;

    @Column({ type: "boolean", default: false })
    is_admin_approved: boolean;

    @ManyToOne(() => UserEntity, user => user.products)
    @JoinColumn({ name: "seller_uuid" })
    seller: UserEntity;

    @OneToMany(() => CartEntity, cart => cart.product)
    cart: CartEntity[];

    @OneToMany(() => OrderItemEntity, item => item.product)
    order_items: OrderItemEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
