import { MigrationInterface, QueryRunner } from "typeorm";

export class default1678063895375 implements MigrationInterface {
    name = 'default1678063895375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "liked_posts" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "disliked_posts" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp without time zone`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "disliked_posts"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "liked_posts"`);
    }

}
