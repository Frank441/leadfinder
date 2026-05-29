/*
  Warnings:

  - A unique constraint covering the columns `[cuit]` on the table `bcra` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cuit` on table `bcra` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bcra" ALTER COLUMN "cuit" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bcra_cuit_key" ON "bcra"("cuit");
