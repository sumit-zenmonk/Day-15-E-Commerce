import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column({ type: "boolean", default: false })
    is_admin_approved: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
