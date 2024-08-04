/*
  Warnings:

  - Added the required column `region` to the `TribunMediaSentiment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tribunmediasentiment` ADD COLUMN `region` VARCHAR(191) NOT NULL;
