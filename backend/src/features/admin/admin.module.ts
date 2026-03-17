import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { ProductRepository } from "src/infrastructure/repository/product.repo";

@Module({
    imports: [],
    controllers: [AdminController],
    providers: [AdminService, ProductRepository],
    exports: [AdminModule],
})

export class AdminModule { }