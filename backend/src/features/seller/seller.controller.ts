import { Body, Controller, Delete, Get, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { ProductAddDto } from "./dto/product.add.dto";
import type { Request } from "express";
import { ProductUpdateDto } from "./dto/product.update.dto";
import { ProductDeleteDto } from "./dto/product.delete.dto";
import { Roles } from "src/infrastructure/guard/role/role.decorator";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { Role } from "src/enums/user";

@UseGuards(RolesGuard)
@Roles(Role.SELLER)
@Controller('/seller')
export class SellerController {
    constructor(private readonly sellerService: SellerService) { }

    @Post('/product')
    async createroduct(@Body() body: ProductAddDto, @Req() req: Request) {
        return this.sellerService.createProduct(body, req.user);
    }

    @Get('/product')
    async getProducts(@Req() req: Request, @Query('offset') offset?: number, @Query('limit') limit?: number) {
        return this.sellerService.getProducts(req.user, offset, limit);
    }

    @Patch('/product')
    async updateProduct(@Body() body: ProductUpdateDto, @Req() req: Request) {
        return this.sellerService.updateProduct(body, req.user);
    }

    @Delete('/product')
    async deleteProduct(@Body() body: ProductDeleteDto, @Req() req: Request) {
        return this.sellerService.deleteProduct(body, req.user);
    }
}