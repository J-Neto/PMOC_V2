-- DropForeignKey
ALTER TABLE `documentos_condensadoras` DROP FOREIGN KEY `documentos_condensadoras_id_condensadora_fkey`;

-- AddForeignKey
ALTER TABLE `documentos_condensadoras` ADD CONSTRAINT `documentos_condensadoras_id_condensadora_fkey` FOREIGN KEY (`id_condensadora`) REFERENCES `condensadoras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
