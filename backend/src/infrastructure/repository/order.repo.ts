import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OrderEntity } from "src/entities/order.entity";
import { ORDER_STAGE, ORDER_STATUS } from "src/enums/order";

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(OrderEntity, dataSource.createEntityManager());
    }

    async createOrder(user_uuid: string, address: string, total_price: number) {

        const order = this.create({
            user_uuid,
            address,
            total_price
        });

        return await this.save(order);
    }

    async getOrderProducts(user_uuid: string, offset?: number, limit?: number) {
        return await this.find({
            where: {
                user_uuid: user_uuid,
            },
            relations: {
                items: {
                    product: true
                },
            },
            select: {
                uuid: true,
                order_stage: true,
                order_status: true,
                created_at: true,
                address: true,
                total_price: true,
                items: {
                    uuid: true,
                    price: true,
                    quantity: true,
                    product: {
                        uuid: true,
                        product_name: true,
                        is_admin_approved: true,
                        price: true,
                        product_img: true,
                    }
                }
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

    async getSellerOrders(seller_uuid: string, offset?: number, limit?: number) {
        return await this.find({
            where: {
                items: {
                    product: {
                        seller_uuid: seller_uuid
                    }
                }
            },
            relations: {
                items: {
                    product: true
                },
                user: true,
            },
            select: {
                uuid: true,
                order_stage: true,
                order_status: true,
                created_at: true,
                address: true,
                total_price: true,
                items: {
                    uuid: true,
                    price: true,
                    quantity: true,
                    product: {
                        uuid: true,
                        product_name: true,
                        is_admin_approved: true,
                        price: true,
                        product_img: true,
                    }
                },
                user: {
                    email: true,
                    username: true,
                    uuid: true
                }
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

    async updateOrderStatus(order_id: string, status: ORDER_STATUS) {
        return await this.update(
            {
                uuid: order_id,
            },
            {
                order_status: status
            }
        )

    }

    async getOrder(order_id: string) {
        return await this.findOne({
            where: {
                uuid: order_id
            },
            relations: {
                items: {
                    product: true
                },
                user: true,
            },
        })
    }

    async updateOrderStage(order_id: string, stage: ORDER_STAGE) {
        return await this.update(
            {
                uuid: order_id,
            },
            {
                order_stage: stage
            }
        )
    }
}