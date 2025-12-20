-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_user_channel_key" ON "Subscription"("user", "channel");
