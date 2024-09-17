import {MigrationInterface, QueryRunner} from "typeorm";

export class ModificationOnSchedule1721820208757 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `schedule` ADD `orderId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `schedule` ADD UNIQUE INDEX `IDX_ac86a5a1a56701193612a77b51` (`orderId`)", undefined);
        await queryRunner.query("CREATE UNIQUE INDEX `REL_ac86a5a1a56701193612a77b51` ON `schedule` (`orderId`)", undefined);
        await queryRunner.query("ALTER TABLE `schedule` ADD CONSTRAINT `FK_ac86a5a1a56701193612a77b514` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `schedule` DROP FOREIGN KEY `FK_ac86a5a1a56701193612a77b514`", undefined);
        await queryRunner.query("DROP INDEX `REL_ac86a5a1a56701193612a77b51` ON `schedule`", undefined);
        await queryRunner.query("ALTER TABLE `schedule` DROP INDEX `IDX_ac86a5a1a56701193612a77b51`", undefined);
        await queryRunner.query("ALTER TABLE `schedule` DROP COLUMN `orderId`", undefined);
   }

}
