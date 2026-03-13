import { Controller, Get, Query, Req } from "@nestjs/common";
import { GlobalService } from "./global.service";

@Controller()
export class GlobalController {
    constructor(private readonly globalService: GlobalService) { }

    @Get('/products')
    async globalProducts(@Query('offset') offset?: number, @Query('limit') limit?: number) {
        try {
            const products = await this.globalService.globalProducts(offset, limit);
            return {
                data: products,
                message: "Global Product Listing Success"
            }
        }
        catch (error) {
            console.error("Get Global Product Listing Error:", error);
            throw error;
        }
    }
}