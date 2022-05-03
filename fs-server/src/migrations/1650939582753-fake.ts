import { MigrationInterface, QueryRunner } from "typeorm"

export class fake1650939582753 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<void> {
        await queryRunner.query(DROP TABLE "table_name");

    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
