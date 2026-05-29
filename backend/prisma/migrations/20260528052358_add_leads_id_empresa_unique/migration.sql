/*
  Warnings:

  - A unique constraint covering the columns `[id_empresa]` on the table `leads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "leads_id_empresa_key" ON "leads"("id_empresa");
