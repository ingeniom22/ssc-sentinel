/*
  Warnings:

  - You are about to drop the `tribunmediasentiment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `tribunmediasentiment`;

-- CreateTable
CREATE TABLE `mediasentiment` (
    `id` VARCHAR(191) NOT NULL,
    `region` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `subtitleUrl` VARCHAR(191) NULL,
    `introtext` VARCHAR(191) NOT NULL,
    `sTitle` VARCHAR(191) NOT NULL,
    `sUrl` VARCHAR(191) NOT NULL,
    `cTitle` VARCHAR(191) NULL,
    `cUrl` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `timesAgo` VARCHAR(191) NOT NULL,
    `thumb` VARCHAR(191) NOT NULL,
    `video` BOOLEAN NOT NULL,
    `sentiment` VARCHAR(191) NOT NULL,
    `confidence` DOUBLE NOT NULL,

    UNIQUE INDEX `mediasentiment_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
