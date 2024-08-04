-- CreateTable
CREATE TABLE `TribunMediaSentiment` (
    `id` VARCHAR(191) NOT NULL,
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

    UNIQUE INDEX `TribunMediaSentiment_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CyberSecurity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testName` VARCHAR(191) NOT NULL,
    `sessionName` VARCHAR(191) NOT NULL,
    `urlweb` VARCHAR(191) NOT NULL,
    `useajax` VARCHAR(191) NOT NULL,
    `browser` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
