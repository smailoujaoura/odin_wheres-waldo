/*
  Warnings:

  - You are about to drop the `Games` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Games";

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);
