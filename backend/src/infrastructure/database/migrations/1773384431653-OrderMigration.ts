import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class OrderMigration1773384431653 implements MigrationInterface {
    name = "OrderMigration1773384431653"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "order_order_status_enum" AS ENUM('INPROCESS','ACCEPETED','REJECTED')`);
        await queryRunner.query(`CREATE TYPE "order_order_stage_enum" AS ENUM('INPROCESS','INWAY','DELIVERED')`);

        await queryRunner.createTable(
            new Table({
                name: "order",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "user_uuid", type: "uuid" },
                    { name: "product_id", type: "varchar" },
                    { name: "quantity", type: "int" },
                    { name: "address", type: "varchar" },
                    { name: "order_status", type: "order_order_status_enum", default: "'INPROCESS'" },
                    { name: "order_stage", type: "order_order_stage_enum", default: "'INPROCESS'" },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("order", true);
        await queryRunner.query(`DROP TYPE "order_order_stage_enum"`);
        await queryRunner.query(`DROP TYPE "order_order_status_enum"`);
    }
}