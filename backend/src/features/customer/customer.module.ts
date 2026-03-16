import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CartRepository } from "src/infrastructure/repository/cart.repo";
import { OrderRepository } from "src/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/infrastructure/repository/order.item.repo";

@Module({
    imports: [],
    controllers: [CustomerController],
    providers: [CustomerService, CartRepository, OrderRepository, OrderItemRepository],
    exports: [CustomerModule],
})

export class CustomerModule { }