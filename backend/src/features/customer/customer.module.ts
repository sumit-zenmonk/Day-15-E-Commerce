import { Module } from "@nestjs/common";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { CartRepository } from "src/infrastructure/repository/cart.repo";

@Module({
    imports: [],
    controllers: [CustomerController],
    providers: [CustomerService, CartRepository],
    exports: [CustomerModule],
})

export class CustomerModule { }