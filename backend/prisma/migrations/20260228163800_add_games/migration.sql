-- CreateTable
CREATE TABLE "Games" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);
