import { Injectable } from "@nestjs/common";
import { CartEntity } from "src/entities/cart.entity";
import { CartAddDto } from "src/features/customer/dto/cart.add.dto";
import { CartUpdateDto } from "src/features/customer/dto/cart.update.dto";
import { DataSource, In, Repository } from "typeorm";

@Injectable()
export class CartRepository extends Repository<CartEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(CartEntity, dataSource.createEntityManager());
    }

    async addCart(body: CartAddDto, seller_id: string) {
        const Cart = this.create({ ...body, user_uuid: seller_id });
        return await this.save(Cart);
    }

    async updateCart(updateData: CartUpdateDto, user_uuid: string) {
        const { cart_id, ...data } = updateData;

        return await this.update(
            {
                uuid: cart_id,
                user_uuid: user_uuid
            },
            {
                ...data
            }
        );
    }

    async deleteCartProduct(cart_id: string, user_uuid: string) {
        return await this.softDelete({ uuid: cart_id, user_uuid: user_uuid });
    }

    async getCartProducts(user_uuid: string, offset?: number, limit?: number) {
        return await this.find({
            where: {
                user_uuid: user_uuid,
                is_active: true
            },
            select: {
                uuid: true,
                quantity: true,
                product_id: true,
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

    async getCartsByIds(cart_ids: string[], user_uuid: string) {
        return await this.find({
            where: {
                uuid: In(cart_ids),
                user_uuid,
                is_active: true
            }
        });
    }

    async deactivateCarts(cart_ids: string[], user_uuid: string) {
        return await this.update(
            {
                uuid: In(cart_ids),
                user_uuid
            },
            {
                is_active: false
            }
        );
    }
} 