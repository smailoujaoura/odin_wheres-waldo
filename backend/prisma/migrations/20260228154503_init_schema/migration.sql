/*
  Warnings:

  - You are about to drop the `gamesessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `leaderboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "gamesessions" DROP CONSTRAINT "gamesessions_mapId_fkey";

-- DropTable
DROP TABLE "gamesessions";

-- DropTable
DROP TABLE "leaderboard";

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);
