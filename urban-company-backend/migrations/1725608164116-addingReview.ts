import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingReview1725608164116 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `product_review` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `summary` varchar(255) NOT NULL, `body` text NOT NULL, `rating` int NOT NULL, `upvotes` int NOT NULL DEFAULT '0', `downvotes` int NOT NULL DEFAULT '0', `state` varchar(255) NOT NULL, `response` text NULL, `responseCreatedAt` datetime NULL, `id` int NOT NULL AUTO_INCREMENT, `productId` int NULL, `productVariantId` int NULL, `authorId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `product_custom_fields_product_review_product_review` (`productId` int NOT NULL, `productReviewId` int NOT NULL, INDEX `IDX_64b00f06b0cd1e5ffee497338e` (`productId`), INDEX `IDX_70963c94b75c561d63309e3108` (`productReviewId`), PRIMARY KEY (`productId`, `productReviewId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsReviewrating` double NULL", undefined);
        await queryRunner.query("ALTER TABLE `product` ADD `customFieldsReviewcount` double NULL DEFAULT '0'", undefined);
        await queryRunner.query("ALTER TABLE `product_review` ADD CONSTRAINT `FK_06e7335708b5e7870f1eaa608d2` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `product_review` ADD CONSTRAINT `FK_de987f9289b240e8702c9b8148e` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `product_review` ADD CONSTRAINT `FK_15a352d289533a11d67715d353a` FOREIGN KEY (`authorId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `product_custom_fields_product_review_product_review` ADD CONSTRAINT `FK_64b00f06b0cd1e5ffee497338e1` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE", undefined);
        await queryRunner.query("ALTER TABLE `product_custom_fields_product_review_product_review` ADD CONSTRAINT `FK_70963c94b75c561d63309e31089` FOREIGN KEY (`productReviewId`) REFERENCES `product_review`(`id`) ON DELETE CASCADE ON UPDATE CASCADE", undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `product_custom_fields_product_review_product_review` DROP FOREIGN KEY `FK_70963c94b75c561d63309e31089`", undefined);
        await queryRunner.query("ALTER TABLE `product_custom_fields_product_review_product_review` DROP FOREIGN KEY `FK_64b00f06b0cd1e5ffee497338e1`", undefined);
        await queryRunner.query("ALTER TABLE `product_review` DROP FOREIGN KEY `FK_15a352d289533a11d67715d353a`", undefined);
        await queryRunner.query("ALTER TABLE `product_review` DROP FOREIGN KEY `FK_de987f9289b240e8702c9b8148e`", undefined);
        await queryRunner.query("ALTER TABLE `product_review` DROP FOREIGN KEY `FK_06e7335708b5e7870f1eaa608d2`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsReviewcount`", undefined);
        await queryRunner.query("ALTER TABLE `product` DROP COLUMN `customFieldsReviewrating`", undefined);
        await queryRunner.query("DROP INDEX `IDX_70963c94b75c561d63309e3108` ON `product_custom_fields_product_review_product_review`", undefined);
        await queryRunner.query("DROP INDEX `IDX_64b00f06b0cd1e5ffee497338e` ON `product_custom_fields_product_review_product_review`", undefined);
        await queryRunner.query("DROP TABLE `product_custom_fields_product_review_product_review`", undefined);
        await queryRunner.query("DROP TABLE `product_review`", undefined);
   }

}
