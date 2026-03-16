import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductRepository } from "src/infrastructure/repository/product.repo";
import { ProductAddDto } from "./dto/product.add.dto";
import { UserEntity } from "src/entities/user.entity";
import { ProductUpdateDto } from "./dto/product.update.dto";
import { ProductDeleteDto } from "./dto/product.delete.dto";

@Injectable()
export class SellerService {
    constructor(private readonly productRepo: ProductRepository) { }

    async createProduct(body: ProductAddDto, user: UserEntity) {
        try {
            // seller should have to make their produc verstiael
            const isProductALreadyExists = await this.productRepo.getProductsByName(user.uuid, body.product_name);
            if (isProductALreadyExists.length > 0) {
                throw new BadRequestException("Product with this name already exists");
            }
            console.log(isProductALreadyExists, user.uuid, body);
            await this.productRepo.addProduct(body, user.uuid);
            return {
                message: "Product Added Success"
            }
        }
        catch (error) {
            console.error("Add Product Error:", error);
            throw error;
        }
    }

    async getProducts(user: UserEntity, offset?: number, limit?: number) {
        try {
            const product = await this.productRepo.getProducts(user.uuid, offset, limit);
            return {
                data: product,
                message: "Product Listing Success"
            }
        }
        catch (error) {
            console.error("Get Product Listing Error:", error);
            throw error;
        }
    }

    async updateProduct(body: ProductUpdateDto, user: UserEntity) {
        try {
            const { product_id, ...updateData } = body;
            await this.productRepo.updateProduct(updateData, product_id, user.uuid);

            return { message: "Product Updated Success" };
        } catch (error) {
            console.error("Update Product Error:", error);
            throw error;
        }
    }

    async deleteProduct(body: ProductDeleteDto, user: UserEntity) {
        try {
            const { product_id } = body;
            await this.productRepo.deleteProduct(product_id, user.uuid);

            return { message: "Product Deleted Success" };
        } catch (error) {
            console.error("Delete Product Error:", error);
            throw error;
        }
    }
}