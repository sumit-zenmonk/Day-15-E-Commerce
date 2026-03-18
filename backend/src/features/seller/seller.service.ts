import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductRepository } from "src/infrastructure/repository/product.repo";
import { ProductAddDto } from "./dto/product.add.dto";
import { UserEntity } from "src/entities/user.entity";
import { ProductUpdateDto } from "./dto/product.update.dto";
import { ProductDeleteDto } from "./dto/product.delete.dto";
import { OrderRepository } from "src/infrastructure/repository/order.repo";
import { OrderUpdateStatusDto } from "./dto/order.status.update.dto";
import { OrderUpdateStageDto } from "./dto/order.stage.update.dto";
import { ORDER_STATUS } from "src/enums/order";

@Injectable()
export class SellerService {
    constructor(
        private readonly productRepo: ProductRepository,
        private readonly orderRepo: OrderRepository,
    ) { }

    async createProduct(body: ProductAddDto, user: UserEntity) {
        try {
            // seller should have to make their produc verstiael
            const isProductALreadyExists = await this.productRepo.getProductsByName(user.uuid, body.product_name);
            if (isProductALreadyExists.length > 0) {
                throw new BadRequestException("Product with this name already exists");
            }
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
            const data = await this.productRepo.updateProduct(updateData, product_id, user.uuid);

            return {
                data: data,
                message: "Product Updated Success"
            };
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

    async getOrders(user: UserEntity, offset?: number, limit?: number) {
        try {
            const activeOrders = await this.orderRepo.getSellerOrders(user.uuid, offset, limit);
            return {
                data: activeOrders,
                message: "Order Listing Success"
            }
        }
        catch (error) {
            console.error("Get Seller Order Listing Error:", error);
            throw error;
        }
    }
    async updateOrderStatus(body: OrderUpdateStatusDto) {
        try {
            const { order_id, status } = body;
            const order = await this.orderRepo.getOrder(order_id);

            if (!order || order.order_status === status) {
                throw new BadRequestException("This Order status not acceptable");
            }

            if (status === "REJECTED") {
                for (const item of order.items) {
                    const product = item.product;
                    if (!product) continue;
                    // if (product.stock_quantity < item.quantity) {
                    //     throw new BadRequestException(
                    //         `Insufficient stock for product ${product.product_name}`
                    //     );
                    // }

                    product.stock_quantity += item.quantity;
                    await this.productRepo.save(product);
                }
            }
            await this.orderRepo.updateOrderStatus(order_id, status);

            return { message: "Order Status Updated Success" };
        } catch (error) {
            console.error("Order Status Error:", error);
            throw error;
        }
    }

    async updateOrderStage(body: OrderUpdateStageDto) {
        try {
            const { order_id, stage } = body;
            const isExists = await this.orderRepo.getOrder(order_id);

            if (!isExists || isExists.order_stage == stage || isExists.order_status == ORDER_STATUS.REJECTED) {
                throw new BadRequestException("This Order stage not acceptable");
            }

            await this.orderRepo.updateOrderStage(order_id, stage);
            return { message: "Order Stage Updated Success" };
        } catch (error) {
            console.error("Order Stage Error:", error);
            throw error;
        }
    }
}