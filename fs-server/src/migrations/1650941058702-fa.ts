import { MigrationInterface, QueryRunner } from "typeorm"

export class fa1650941058702 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DROP TABLE "post"
        `)

        await queryRunner.query(`
        DROP TABLE "upvote"
        `)
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
