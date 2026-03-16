import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class OrderItemMigration1773384431660 implements MigrationInterface {
    name = "OrderItemMigration1773384431660"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "order_item",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "order_id", type: "uuid" },
                    { name: "product_id", type: "uuid" },
                    { name: "price", type: "int" },
                    { name: "quantity", type: "int" },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "order_item",
            new TableForeignKey({
                name: "FK_orderitem_order",
                columnNames: ["order_id"],
                referencedTableName: "order",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
        );

        await queryRunner.createForeignKey(
            "order_item",
            new TableForeignKey({
                name: "FK_orderitem_product",
                columnNames: ["product_id"],
                referencedTableName: "product",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("order_item", "FK_orderitem_order");
        await queryRunner.dropForeignKey("order_item", "FK_orderitem_product");
        await queryRunner.dropTable("order_item");
    }
}