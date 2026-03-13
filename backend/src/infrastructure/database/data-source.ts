//Data-Source imports
import { DataSource, DataSourceOptions } from "typeorm";

//Entities
import { UserEntity } from "src/entities/user.entity";
import { ProductEntity } from "src/entities/product.entity";
import { CartEntity } from "src/entities/cart.entity";
import { OrderEntity } from "src/entities/order.entity";

const options: DataSourceOptions = {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432, //5433
    username: "postgres",
    password: "123", //sumit123
    database: "Big-Ecommerce",
    entities: [UserEntity, ProductEntity, CartEntity, OrderEntity],
    synchronize: false,
    migrations: ['dist/infrastructure/database/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(options);

export { dataSource };