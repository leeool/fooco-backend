import { MigrationInterface, QueryRunner } from "typeorm";

export class default1678715067781 implements MigrationInterface {
    name = 'default1678715067781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "liked_posts"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "disliked_posts"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "users_liked" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "users_disliked" character varying array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "users_disliked"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "users_liked"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "disliked_posts" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "liked_posts" character varying array NOT NULL DEFAULT '{}'`);
    }

}
