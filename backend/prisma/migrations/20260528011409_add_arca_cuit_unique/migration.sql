/*
  Warnings:

  - A unique constraint covering the columns `[cuit]` on the table `arca` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cuit` on table `arca` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "arca" ALTER COLUMN "cuit" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "arca_cuit_key" ON "arca"("cuit");
