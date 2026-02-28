/*
  Warnings:

  - Added the required column `iconUrl` to the `characters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "characters" ADD COLUMN     "iconUrl" TEXT NOT NULL;
