import { Injectable } from "@nestjs/common";
import { OrderItemEntity } from "src/entities/order.item.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class OrderItemRepository extends Repository<OrderItemEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(OrderItemEntity, dataSource.createEntityManager());
    }

    async createOrderItems(items: Partial<OrderItemEntity>[]) {

        const orderItems = items.map(item => this.create(item));

        return await this.save(orderItems);
    }
}