import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1650942227897 implements MigrationInterface {
    name = 'Init1650942227897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upvote" ADD "value2" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "upvote" DROP COLUMN "value2"`);
    }

}
