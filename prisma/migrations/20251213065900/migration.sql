/*
  Warnings:

  - You are about to drop the column `channelImage` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "channelImage",
DROP COLUMN "views";
