import {MigrationInterface, QueryRunner} from "typeorm";

export class ModificationOnSchedule21721823528335 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_ac86a5a1a56701193612a77b51` ON `schedule`", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE UNIQUE INDEX `IDX_ac86a5a1a56701193612a77b51` ON `schedule` (`orderId`)", undefined);
   }

}
