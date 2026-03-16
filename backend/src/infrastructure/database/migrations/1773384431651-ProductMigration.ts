import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ProductMigration1773384431651 implements MigrationInterface {
    name = "ProductMigration1773384431651"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "product",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "seller_uuid", type: "uuid" },
                    { name: "product_name", type: "varchar" },
                    { name: "stock_quantity", type: "int" },
                    { name: "product_img", type: "varchar" },
                    { name: "price", type: "int" },
                    { name: "is_admin_approved", type: "boolean", default: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "product",
            new TableForeignKey({
                name: "FK_product_seller",
                columnNames: ["seller_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("product", "FK_product_seller");
        await queryRunner.dropTable("product");
    }
}