import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserMigration1773384431650 implements MigrationInterface {
    name = "UserMigration1773384431650"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "users_role_enum" AS ENUM('USER','SELLER','ADMIN')`);

        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    { name: "uuid", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "username", type: "varchar" },
                    { name: "email", type: "varchar", isUnique: true },
                    { name: "password", type: "varchar" },
                    { name: "is_active", type: "boolean", default: "true" },
                    { name: "role", type: "users_role_enum", default: "'USER'" },
                    { name: "created_at", type: "timestamp", default: "now()" },
                    { name: "updated_at", type: "timestamp", default: "now()" },
                    { name: "deleted_at", type: "timestamp", isNullable: true },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users", true);
        await queryRunner.query(`DROP TYPE "users_role_enum"`);
    }
}