import { Module } from "@nestjs/common";
import { GlobalService } from "./global.service";
import { GlobalController } from "./global.controller";
import { ProductRepository } from "src/infrastructure/repository/product.repo";

@Module({
    imports: [],
    controllers: [GlobalController],
    providers: [GlobalService, ProductRepository],
    exports: [GlobalModule],
})

export class GlobalModule { }