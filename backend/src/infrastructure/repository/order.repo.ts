import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OrderEntity } from "src/entities/order.entity";

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
                items: true
            },
            select: {
                uuid: true,
                product_id: true,
                items: {
                    product: {
                        product_name: true,
                        is_admin_approved: true,
                        price: true,
                        product_img: true,
                    }
                },
                order_stage: true,
                order_status: true,
                created_at: true,
                address: true,
                total_price: true,
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

}