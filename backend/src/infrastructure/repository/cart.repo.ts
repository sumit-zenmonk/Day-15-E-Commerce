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
        const cart = this.create({ ...body, user_uuid: seller_id });
        const savedCart = await this.save(cart);

        return await this.findOne({
            where: { uuid: savedCart.uuid },
            relations: { product: true },
            select: {
                uuid: true,
                product_id: true,
                quantity: true,
                product: {
                    price: true,
                    product_name: true,
                    product_img: true
                }
            }
        });
    }

    async updateCart(updateData: CartUpdateDto, user_uuid: string) {
        const { cart_id, ...data } = updateData;

        await this.update(
            {
                uuid: cart_id,
                user_uuid: user_uuid
            },
            {
                ...data
            }
        );

        return await this.findOne({
            where: { uuid: cart_id },
            relations: { product: true },
            select: {
                uuid: true,
                product_id: true,
                quantity: true,
                product: {
                    price: true,
                    product_name: true,
                    product_img: true,
                    stock_quantity: true
                }
            }
        });
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
            relations: {
                product: true
            },
            select: {
                uuid: true,
                product_id: true,
                quantity: true,
                product: {
                    product_img: true,
                    price: true,
                    product_name: true,
                    is_admin_approved: true,
                    stock_quantity: true
                }
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
            }, relations: {
                product: true
            }
            ,
            select: {
                product: {
                    price: true
                }
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

    async getCartsByProductId(cart_id: string, user_uuid: string) {
        return await this.findOne({
            where: {
                product_id: cart_id,
                user_uuid,
                is_active: true
            },
            relations: {
                product: true
            },
            select: {
                uuid: true,
                product_id: true,
                quantity: true,
                product: {
                    product_img: true,
                    price: true,
                    product_name: true,
                    is_admin_approved: true
                }
            }
        });
    }
} 