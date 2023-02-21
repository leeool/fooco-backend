import { MigrationInterface, QueryRunner } from "typeorm";

export class default1677013523918 implements MigrationInterface {
    name = 'default1677013523918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_16a70a67a7fd49cb97520b5d22a"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "user" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "user_id" TO "user"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_16a70a67a7fd49cb97520b5d22a" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
