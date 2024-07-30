import {MigrationInterface, QueryRunner} from "typeorm";

export class TestMigration1719487804799 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `customer` DROP FOREIGN KEY `FK_14e5b31a6af5523c8b1f2f68dae`", undefined);
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFields__fix_relational_custom_fields__`", undefined);
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFieldsProfilepicid`", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `customer` ADD `customFieldsProfilepicid` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD `customFields__fix_relational_custom_fields__` tinyint NULL COMMENT 'A work-around needed when only relational custom fields are defined on an entity'", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD CONSTRAINT `FK_14e5b31a6af5523c8b1f2f68dae` FOREIGN KEY (`customFieldsProfilepicid`) REFERENCES `customore_profile_picture`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
   }

}
