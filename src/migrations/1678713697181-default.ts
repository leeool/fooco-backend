import { MigrationInterface, QueryRunner } from "typeorm";

export class default1678713697181 implements MigrationInterface {
    name = 'default1678713697181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "tags" character varying array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "tags" character varying array NOT NULL DEFAULT '{}'`);
    }

}
