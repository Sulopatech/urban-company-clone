import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCustomFieldOrder1720508302902 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `order` ADD `customFieldsDate` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `order` ADD `customFieldsTime` varchar(255) NULL", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `customFieldsTime`", undefined);
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `customFieldsDate`", undefined);
   }

}
