import { BadRequestException, Injectable } from "@nestjs/common";
import { CartRepository } from "src/infrastructure/repository/cart.repo";
import { CartAddDto } from "./dto/cart.add.dto";
import { UserEntity } from "src/entities/user.entity";
import { CartUpdateDto } from "./dto/cart.update.dto";
import { CartDeleteDto } from "./dto/cart.delete.dto copy";
import { CreateOrderDto } from "./dto/order.create.dto";
import { OrderRepository } from "src/infrastructure/repository/order.repo";
import { OrderItemRepository } from "src/infrastructure/repository/order.item.repo";
import { CreateAddressDto } from "./dto/address.create.dto";
import { UserAddressRepository } from "src/infrastructure/repository/user.address.repo";
import { DataSource, In } from "typeorm";
import { CartEntity } from "src/entities/cart.entity";
import { OrderEntity } from "src/entities/order.entity";
import { ProductEntity } from "src/entities/product.entity";
import { OrderItemEntity } from "src/entities/order.item.entity";

@Injectable()
export class CustomerService {
    constructor(
        private readonly cartRepo: CartRepository,
        private readonly orderRepo: OrderRepository,
        private readonly orderItemRepo: OrderItemRepository,
        private readonly userAddressRepo: UserAddressRepository,
        private readonly dataSource: DataSource,
    ) { }

    async addToCart(body: CartAddDto, user: UserEntity) {
        try {
            // check isExists
            const isActivecart = await this.cartRepo.getCartsByProductId(body.product_id, user.uuid);
            if (isActivecart) {
                return {
                    cartProduct: isActivecart,
                    message: "Already Active Cart Product"
                }
            }

            const cartProduct = await this.cartRepo.addCart(body, user.uuid);
            return {
                cartProduct: cartProduct,
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
            const cartProduct = await this.cartRepo.updateCart(body, user.uuid);
            return {
                cartProduct: cartProduct,
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
        return await this.dataSource.transaction(async (manager) => {
            const { cart_ids, address, total_price } = body;

            // get all carts
            const carts = await manager.find(CartEntity, {
                where: {
                    uuid: In(cart_ids),
                    user_uuid: user.uuid,
                    is_active: true
                },
                relations: { product: true }
            });

            if (!carts.length) {
                throw new BadRequestException("Cart items not found");
            }

            // lock products
            const productIds = carts.map(c => c.product_id);

            const products = await manager
                .createQueryBuilder(ProductEntity, "product")
                .where("product.uuid IN (:...ids)", { ids: productIds })
                .setLock("pessimistic_write_or_fail")
                .getMany();

            // check stock
            for (const cart of carts) {
                const product = products.find(p => p.uuid === cart.product_id);

                if (!product || product.stock_quantity < cart.quantity) {
                    throw new BadRequestException("Insufficient stock");
                }
            }

            // deduct stock
            for (const cart of carts) {
                await manager.decrement(
                    ProductEntity,
                    { uuid: cart.product_id },
                    "stock_quantity",
                    cart.quantity
                );
            }

            // create order
            const order = await manager.save(OrderEntity, {
                user_uuid: user.uuid,
                address,
                total_price
            });

            // order items
            const orderItems = carts.map(cart => ({
                order_id: order.uuid,
                product_id: cart.product_id,
                quantity: cart.quantity,
                price: cart.product.price
            }));

            await manager.save(OrderItemEntity, orderItems);

            // deactivate cart
            await manager.update(
                CartEntity,
                { uuid: In(cart_ids), user_uuid: user.uuid },
                { is_active: false }
            );

            return {
                message: "Order Created Successfully",
                order_id: order.uuid
            };
        });
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

    async createAddress(body: CreateAddressDto, user: UserEntity) {
        try {
            return await this.userAddressRepo.createUserAddress({
                ...body,
                user_uuid: user.uuid
            });
        }
        catch (error) {
            console.error("Get Order Product Listing Error:", error);
            throw error;
        }
    }
}