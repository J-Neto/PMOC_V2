/*
  Warnings:

  - Added the required column `descricao` to the `manutencoes_corretivas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manutencoes_corretivas` ADD COLUMN `descricao` VARCHAR(191) NOT NULL;
