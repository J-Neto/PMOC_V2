-- AlterTable
ALTER TABLE `equipamentos` MODIFY `status` ENUM('normal', 'defeito', 'parado') NOT NULL DEFAULT 'normal';
