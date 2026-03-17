import { Injectable } from "@nestjs/common";
import { ProductRepository } from "src/infrastructure/repository/product.repo";
import { adminApproveProductDto } from "./dto/product.approve.dto";

@Injectable()
export class AdminService {
    constructor(private readonly productRepo: ProductRepository) { }

    async changeProductApprove(body: adminApproveProductDto) {
        try {
            return await this.productRepo.changeProductApprove(body.product_id,body.approve);
        }
        catch (error) {
            console.error("Update Product Approve Error:", error);
            throw error;
        }
    }
}   