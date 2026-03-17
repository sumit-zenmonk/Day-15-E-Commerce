import { Body, Controller, Post, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { adminApproveProductDto } from "./dto/product.approve.dto";
import { RolesGuard } from "src/infrastructure/guard/role/role.guard";
import { Role } from "src/enums/user";
import { Roles } from "src/infrastructure/guard/role/role.decorator";

@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Post('/approve_product')
    async approveProduct(@Body() body: adminApproveProductDto) {
        return this.adminService.changeProductApprove(body);
    }
}