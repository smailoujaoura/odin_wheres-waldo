-- CreateTable
CREATE TABLE "maps" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "xPct" DOUBLE PRECISION NOT NULL,
    "yPct" DOUBLE PRECISION NOT NULL,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamesessions" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "charactersFound" INTEGER NOT NULL DEFAULT 0,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "gamesessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "mapId" TEXT NOT NULL,

    CONSTRAINT "leaderboard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamesessions" ADD CONSTRAINT "gamesessions_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
