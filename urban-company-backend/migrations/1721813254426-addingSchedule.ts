import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingSchedule1721813254426 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `schedule` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `originalStartDate` datetime NOT NULL, `originalEndDate` datetime NOT NULL, `originalStartTime` varchar(255) NOT NULL, `originalEndTime` varchar(255) NOT NULL, `currentStartDate` datetime NOT NULL, `currentEndDate` datetime NOT NULL, `currentStartTime` varchar(255) NOT NULL, `currentEndTime` varchar(255) NOT NULL, `lastRescheduledDate` datetime NULL, `rescheduleFrequency` int NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `order` ADD `customFieldsScheduleid` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `order` ADD CONSTRAINT `FK_e18ba2113d8781cf08c538f3a3b` FOREIGN KEY (`customFieldsScheduleid`) REFERENCES `schedule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `order` DROP FOREIGN KEY `FK_e18ba2113d8781cf08c538f3a3b`", undefined);
        await queryRunner.query("ALTER TABLE `order` DROP COLUMN `customFieldsScheduleid`", undefined);
        await queryRunner.query("DROP TABLE `schedule`", undefined);
   }

}
