import { MigrationInterface, QueryRunner } from "typeorm";

export class default1678052857441 implements MigrationInterface {
    name = 'default1678052857441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "liked_posts" character varying array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "liked_posts"`);
    }

}
