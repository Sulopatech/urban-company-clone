import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCustomFieldCustomerAndProducts1719987064714 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFields__fix_relational_custom_fields__`", undefined);
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsWeekdays` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsWeekends` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsLocation` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsX_coordinate` double NULL", undefined);
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsY_coordinate` double NULL", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD `customFieldsCurrentlocation` varchar(255) NULL", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD `customFieldsX_coordinaties` double NULL", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD `customFieldsY_coordinates` double NULL", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFieldsY_coordinates`", undefined);
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFieldsX_coordinaties`", undefined);
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFieldsCurrentlocation`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsY_coordinate`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsX_coordinate`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsLocation`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsWeekends`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsWeekdays`", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD `customFields__fix_relational_custom_fields__` tinyint NULL COMMENT 'A work-around needed when only relational custom fields are defined on an entity'", undefined);
   }

}
