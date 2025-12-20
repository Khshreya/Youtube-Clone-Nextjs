/*
  Warnings:

  - A unique constraint covering the columns `[user,videoId]` on the table `History` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "History_user_videoId_key" ON "History"("user", "videoId");
