/*
  Warnings:

  - A unique constraint covering the columns `[renspa]` on the table `senasa` will be added. If there are existing duplicate values, this will fail.
  - Made the column `renspa` on table `senasa` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "senasa" ALTER COLUMN "renspa" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "senasa_renspa_key" ON "senasa"("renspa");
