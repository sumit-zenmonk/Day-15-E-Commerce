import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/infrastructure/repository/product.repo";

@Injectable()
export class GlobalService {
    constructor(private readonly productRepo: ProductRepository) { }

    async globalProducts(offset?: number, limit?: number) {
        try {
            return await this.productRepo.getAllProducts(offset, limit);
        }
        catch (error) {
            console.error("Get Global Product Listing Error:", error);
            throw error;
        }
    }
}   