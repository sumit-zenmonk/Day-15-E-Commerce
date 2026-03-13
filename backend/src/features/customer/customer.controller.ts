import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { Role } from "src/enums/user";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { CustomerService } from "./customer.service";
import { CartAddDto } from "./dto/cart.add.dto";
import type { Request } from "express";
import { CartUpdateDto } from "./dto/cart.update.dto";
import { CartDeleteDto } from "./dto/cart.delete.dto copy";

@UseGuards(RolesGuard)
@Roles(Role.USER)
@Controller('/customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Get('/cart')
    async getCarts(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        try {
            return this.customerService.getCarts(req.user, offset, limit);
        }
        catch (error) {
            console.error("Add to Cart Customer Error:", error);
            throw error;
        }
    }

    @Post('/cart')
    async AddCart(@Body() body: CartAddDto, @Req() req: Request) {
        try {
            return await this.customerService.addToCart(body, req.user);
        }
        catch (error) {
            console.error("Add to Cart Customer Error:", error);
            throw error;
        }
    }

    @Patch('/cart')
    async UpdateCart(@Body() body: CartUpdateDto, @Req() req: Request) {
        try {
            return await this.customerService.updateCart(body, req.user);
        }
        catch (error) {
            console.error("Update to Cart Customer Error:", error);
            throw error;
        }
    }

    @Delete('/cart')
    async DeleteCart(@Body() body: CartDeleteDto, @Req() req: Request) {
        try {
            return await this.customerService.deleteCart(body, req.user);
        }
        catch (error) {
            console.error("Delete to Cart Customer Error:", error);
            throw error;
        }
    }
}