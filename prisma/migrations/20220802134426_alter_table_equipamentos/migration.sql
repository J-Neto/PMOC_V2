/*
  Warnings:

  - You are about to drop the column `data_termino` on the `documentos` table. All the data in the column will be lost.
  - You are about to drop the column `previsao_termino` on the `documentos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `documentos` DROP COLUMN `data_termino`,
    DROP COLUMN `previsao_termino`;

-- AlterTable
ALTER TABLE `equipamentos` MODIFY `status` ENUM('normal', 'defeito') NOT NULL DEFAULT 'normal';
