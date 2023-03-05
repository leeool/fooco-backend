import { MigrationInterface, QueryRunner } from "typeorm";

export class default1678053521454 implements MigrationInterface {
    name = 'default1678053521454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "disliked_posts" character varying array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "disliked_posts"`);
    }

}
