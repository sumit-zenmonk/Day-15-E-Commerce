import { Injectable } from "@nestjs/common";
import { UserAddressEntity } from "src/entities/user.address.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class UserAddressRepository extends Repository<UserAddressEntity> {
    constructor(private readonly dataSource: DataSource) {
        super(UserAddressEntity, dataSource.createEntityManager());
    }

    async createUserAddress(addressData: Partial<UserAddressEntity>) {
        return await this.save(addressData);
    }
}