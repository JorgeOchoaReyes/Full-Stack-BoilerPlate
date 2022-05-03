import { MigrationInterface, QueryRunner } from "typeorm"

export class a1650940396236 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user" "post" "upvote"`)
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
