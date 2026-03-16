import { Role } from "src/enums/user";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { ProductEntity } from "./product.entity";
import { CartEntity } from "./cart.entity";
import { OrderEntity } from "./order.entity";

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "varchar" })
    username: string;

    @Column({ type: "varchar", unique: true })
    email: string;

    @Column({ type: "varchar" })
    password: string;

    @Column({ type: "boolean", default: true })
    is_active: boolean;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER,
    })
    role: Role;

    @OneToMany(() => ProductEntity, product => product.seller)
    products: ProductEntity[];

    @OneToMany(() => CartEntity, cart => cart.user)
    cart: CartEntity[];

    @OneToMany(() => OrderEntity, order => order.user)
    orders: OrderEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
