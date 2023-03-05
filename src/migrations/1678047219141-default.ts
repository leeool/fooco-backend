import { MigrationInterface, QueryRunner } from "typeorm";

export class default1678047219141 implements MigrationInterface {
    name = 'default1678047219141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tags" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "educational_place" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "educational_place_url" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "about" character varying(100) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar_url" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ADD "banner_url" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "banner_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "about"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "educational_place_url"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "educational_place"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tags"`);
    }

}
