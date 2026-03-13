import { Injectable } from "@nestjs/common";
import { ProductEntity } from "src/entities/product.entity";
import { ProductAddDto } from "src/features/seller/dto/product.add.dto";
import { ProductUpdateDto } from "src/features/seller/dto/product.update.dto";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class ProductRepository extends Repository<ProductEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductEntity, dataSource.createEntityManager());
    }

    async addProduct(body: ProductAddDto, seller_id: string) {
        const product = this.create({ ...body, seller_uuid: seller_id });
        return await this.save(product);
    }

    async getProducts(seller_id: string, offset?: number, limit?: number) {
        return await this.find({
            where: {
                seller_uuid: seller_id
            },
            select: {
                uuid: true,
                product_name: true,
                product_img: true,
                stock_quantity: true,
                is_admin_approved: true,
                created_at: true,
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }

    async updateProduct(updateData: Partial<ProductUpdateDto>, product_id: string, seller_id: string) {
        return await this.update(
            {
                uuid: product_id,
                seller_uuid: seller_id
            },
            {
                ...updateData
            }
        );
    }

    async deleteProduct(product_id: string, seller_id: string) {
        return await this.softDelete({ uuid: product_id, seller_uuid: seller_id });
    }

    async getAllProducts(offset?: number, limit?: number) {
        return await this.find({
            select: {
                uuid: true,
                product_name: true,
                product_img: true,
                stock_quantity: true,
                is_admin_approved: true,
                created_at: true,
            },
            skip: offset ?? Number(process.env.page_offset) ?? 0,
            take: limit ?? Number(process.env.page_limit) ?? 10
        });
    }
}