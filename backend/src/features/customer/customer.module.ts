import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CartRepository } from "src/infrastructure/repository/cart.repo";
import { OrderRepository } from "src/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/infrastructure/repository/order.item.repo";
import { UserAddressRepository } from "src/infrastructure/repository/user.address.repo";

@Module({
    imports: [],
    controllers: [CustomerController],
    providers: [CustomerService, CartRepository, OrderRepository, OrderItemRepository, UserAddressRepository],
    exports: [CustomerModule],
})

export class CustomerModule { }