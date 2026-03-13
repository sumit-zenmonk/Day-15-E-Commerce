import { Injectable } from "@nestjs/common";
import { CartRepository } from "src/infrastructure/repository/cart.repo";
import { CartAddDto } from "./dto/cart.add.dto";
import { UserEntity } from "src/entities/user.entity";
import { CartUpdateDto } from "./dto/cart.update.dto";
import { CartDeleteDto } from "./dto/cart.delete.dto copy";

@Injectable()
export class CustomerService {
    constructor(private readonly cartRepo: CartRepository) { }

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
}