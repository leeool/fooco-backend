import { MigrationInterface, QueryRunner } from "typeorm";

export class default1679872209018 implements MigrationInterface {
    name = 'default1679872209018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "slug" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "slug"`);
    }

}
