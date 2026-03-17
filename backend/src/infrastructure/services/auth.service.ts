import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/entities/user.entity";

@Injectable()
export class AuthHelperService {
    constructor(private readonly jwtService: JwtService) { }

    async generateJwtToken(userObj: UserEntity) {
        const payload = {
            uuid: userObj.uuid,
            email: userObj.email,
            username: userObj.username,
            role: userObj.role,
            address: userObj.addresses
        };

        return await this.jwtService.signAsync(payload);
    }

    async verifyJwtToken(token: string) {
        token = token.replace(/^"(.*)"$/, '$1');
        return await this.jwtService.verifyAsync(token);
    }
}