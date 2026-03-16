import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ProductEntity } from "./product.entity";

@Entity('cart')
export class CartEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid" })
    user_uuid: string;

    @Column({ type: "uuid" })
    product_id: string;

    @Column({ type: "int" })
    quantity: number;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @ManyToOne(() => UserEntity, user => user.cart)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @ManyToOne(() => ProductEntity, product => product.cart)
    @JoinColumn({ name: "product_id" })
    product: ProductEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
