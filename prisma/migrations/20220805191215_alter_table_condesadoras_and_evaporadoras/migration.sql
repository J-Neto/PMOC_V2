-- AlterTable
ALTER TABLE `condensadoras` ADD COLUMN `status_anterior` ENUM('normal', 'defeito', 'parado') NULL;

-- AlterTable
ALTER TABLE `evaporadoras` ADD COLUMN `status_anterior` ENUM('normal', 'defeito', 'parado') NULL;
