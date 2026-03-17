import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class UserAddressMigration1773384431661 implements MigrationInterface {
    name = "UserAddressMigration1773384431661"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "user_addresses",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "user_uuid", type: "uuid" },
                    { name: "street_address", type: "varchar", length: "255" },
                    { name: "apartment_suite", type: "varchar", length: "100", isNullable: true },
                    { name: "city", type: "varchar", length: "100" },
                    { name: "state_province", type: "varchar", length: "100" },
                    { name: "postal_code", type: "varchar", length: "20" },
                    { name: "country", type: "varchar", length: "100" },
                    { name: "is_default", type: "boolean", default: false },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "user_addresses",
            new TableForeignKey({
                name: "FK_user_address",
                columnNames: ["user_uuid"],
                referencedTableName: "users",
                referencedColumnNames: ["uuid"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("user_addresses", "FK_user_address");
        await queryRunner.dropTable("user_addresses");
    }
}