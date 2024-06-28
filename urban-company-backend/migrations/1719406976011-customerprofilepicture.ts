import {MigrationInterface, QueryRunner} from "typeorm";

export class Customerprofilepicture1719406976011 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `customore_profile_picture` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD `customFieldsProfilepicid` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD `customFields__fix_relational_custom_fields__` tinyint NULL COMMENT 'A work-around needed when only relational custom fields are defined on an entity'", undefined);
        await queryRunner.query("ALTER TABLE `customer` ADD CONSTRAINT `FK_14e5b31a6af5523c8b1f2f68dae` FOREIGN KEY (`customFieldsProfilepicid`) REFERENCES `customore_profile_picture`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `customer` DROP FOREIGN KEY `FK_14e5b31a6af5523c8b1f2f68dae`", undefined);
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFields__fix_relational_custom_fields__`", undefined);
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `customFieldsProfilepicid`", undefined);
        await queryRunner.query("DROP TABLE `customore_profile_picture`", undefined);
   }

}
