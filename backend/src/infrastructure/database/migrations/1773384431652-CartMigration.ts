import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CartMigration1773384431652 implements MigrationInterface {
    name = "CartMigration1773384431652"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "cart",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "user_uuid", type: "uuid" },
                    { name: "product_id", type: "uuid" },
                    { name: "quantity", type: "int" },
                    { name: "is_active", type: "boolean", default: true },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "cart",
            new TableForeignKey({
                name: "FK_cart_user",
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "cart",
            new TableForeignKey({
                name: "FK_cart_product",
                columnNames: ["product_id"],
                referencedTableName: "product",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("cart", "FK_cart_user");
        await queryRunner.dropForeignKey("cart", "FK_cart_product");
        await queryRunner.dropTable("cart");
    }
}