import { Module } from "@nestjs/common";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";
import { ProductRepository } from "src/infrastructure/repository/product.repo";

@Module({
    imports: [],
    controllers: [SellerController],
    providers: [SellerService, ProductRepository],
    exports: [SellerModule],
})

export class SellerModule { }