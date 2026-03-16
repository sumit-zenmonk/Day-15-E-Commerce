import { BadRequestException, Injectable } from "@nestjs/common";
import { CartRepository } from "src/infrastructure/repository/cart.repo";
import { CartAddDto } from "./dto/cart.add.dto";
import { UserEntity } from "src/entities/user.entity";
import { CartUpdateDto } from "./dto/cart.update.dto";
import { CartDeleteDto } from "./dto/cart.delete.dto copy";
import { CreateOrderDto } from "./dto/order.create.dto";
import { OrderRepository } from "src/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/infrastructure/repository/order.item.repo";

@Injectable()
export class CustomerService {
    constructor(
        private readonly cartRepo: CartRepository,
        private readonly orderRepo: OrderRepository,
        private readonly orderItemRepo: OrderItemRepository
    ) { }

    async addToCart(body: CartAddDto, user: UserEntity) {
        try {
            await this.cartRepo.addCart(body, user.uuid);
            return {
                message: "Product Added to Cart Success"
            }
        }
        catch (error) {
            console.error("Add to Cart Product Error:", error);
            throw error;
        }
    }

    async updateCart(body: CartUpdateDto, user: UserEntity) {
        try {
            await this.cartRepo.updateCart(body, user.uuid);
            return {
                message: "Product updated to Cart Success"
            }
        }
        catch (error) {
            console.error("updated to Cart Product Error:", error);
            throw error;
        }
    }

    async deleteCart(body: CartDeleteDto, user: UserEntity) {
        try {
            const { cart_id } = body;
            await this.cartRepo.deleteCartProduct(cart_id, user.uuid);
            return { message: "Cart Product Deleted Success" };
        } catch (error) {
            console.error("Delete Cart Product Error:", error);
            throw error;
        }
    }

    async getCarts(user: UserEntity, offset?: number, limit?: number) {
        try {
            const product = await this.cartRepo.getCartProducts(user.uuid, offset, limit);
            return {
                data: product,
                message: "Cart Product Listing Success"
            }
        }
        catch (error) {
            console.error("Get Cart Product Listing Error:", error);
            throw error;
        }
    }

    async createOrder(body: CreateOrderDto, user: UserEntity) {
        try {
            const { cart_ids, address, total_price } = body;

            const carts = await this.cartRepo.getCartsByIds(cart_ids, user.uuid);
            if (!carts.length) {
                throw new BadRequestException("Cart items not found");
            }

            const order = await this.orderRepo.createOrder(
                user.uuid,
                address,
                total_price
            );

            const orderItems = carts.map(cart => ({
                order_id: order.uuid,
                product_id: cart.product_id,
                quantity: cart.quantity,
                price: 0
            }));

            await this.orderItemRepo.createOrderItems(orderItems);
            await this.cartRepo.deactivateCarts(cart_ids, user.uuid);

            return {
                message: "Order Created Successfully",
                order_id: order.uuid
            };
        } catch (error) {
            console.error("Create Order Error:", error);
            throw error;
        }
    }

    async getOrders(user: UserEntity, offset?: number, limit?: number) {
        try {
            const product = await this.orderRepo.getOrderProducts(user.uuid, offset, limit);
            return {
                data: product,
                message: "Order Product Listing Success"
            }
        }
        catch (error) {
            console.error("Get Order Product Listing Error:", error);
            throw error;
        }
    }
}