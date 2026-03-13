import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CartMigration1773384431652 implements MigrationInterface {
    name = "CartMigration1773384431652"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cart",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "user_uuid", type: "uuid" },
                    { name: "product_id", type: "varchar" },
                    { name: "quantity", type: "int" },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("cart", true);
    }
}