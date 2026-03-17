import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity('user_addresses')
export class UserAddressEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "uuid" })
    user_uuid: string;

    @Column({ type: "varchar", length: 255 })
    street_address: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    apartment_suite: string;

    @Column({ type: "varchar", length: 100 })
    city: string;

    @Column({ type: "varchar", length: 100 })
    state_province: string;

    @Column({ type: "varchar", length: 20 })
    postal_code: string;

    @Column({ type: "varchar", length: 100 })
    country: string;

    @Column({ type: "boolean", default: false })
    is_default: boolean;

    @ManyToOne(() => UserEntity, user => user.addresses)
    @JoinColumn({ name: "user_uuid" })
    user: UserEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
