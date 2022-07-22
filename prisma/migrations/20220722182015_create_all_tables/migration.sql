-- CreateTable
CREATE TABLE `itens` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarefas` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `tipo` ENUM('SPLIT', 'VRF') NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `frequencia` ENUM('mensal', 'trimestral', 'semestral', 'anual') NOT NULL,
    `id_item` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setores` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salas` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `andar` VARCHAR(191) NOT NULL,
    `dimensao` VARCHAR(191) NULL,
    `id_setor` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `relatorios` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `acao` VARCHAR(191) NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `id_entidade` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `condensadoras` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NULL,
    `status` ENUM('normal', 'defeito', 'parado') NOT NULL,
    `modulo` VARCHAR(191) NULL,
    `quadro` VARCHAR(191) NULL,
    `local_instalacao` VARCHAR(191) NULL,

    UNIQUE INDEX `condensadoras_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `evaporadoras` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NULL,
    `marca` VARCHAR(191) NULL,
    `potencia` DOUBLE NOT NULL DEFAULT 0,
    `status` ENUM('normal', 'defeito', 'parado') NOT NULL,
    `quadro` VARCHAR(191) NULL,
    `id_sala` VARCHAR(191) NULL,

    UNIQUE INDEX `evaporadoras_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipamentos` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `tipo` ENUM('SPLIT', 'VRF') NOT NULL,
    `linha` VARCHAR(191) NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `status` ENUM('normal', 'defeito') NOT NULL,
    `id_condensadora` VARCHAR(191) NOT NULL,
    `id_evaporadora` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `equipamentos_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manutencoes` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `tipo` ENUM('corretiva', 'preventiva') NOT NULL,
    `status` ENUM('executar', 'atrasado', 'realizado', 'execucao', 'espera', 'agendado') NOT NULL,
    `comentario` VARCHAR(191) NULL,
    `tec_responsavel` VARCHAR(191) NOT NULL,
    `custo` DOUBLE NULL,
    `agendado` BOOLEAN NULL DEFAULT false,
    `foto` VARCHAR(191) NULL,
    `previsao_termino` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_termino` DATETIME(3) NULL,
    `data_agendado` DATETIME(3) NULL,
    `id_condensadora` VARCHAR(191) NULL,
    `id_evaporadora` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manutencoes_preventivas` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `previsao_termino` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_termino` DATETIME(3) NULL,
    `data_agendado` DATETIME(3) NULL,
    `id_manutencao` VARCHAR(191) NOT NULL,
    `id_item` VARCHAR(191) NOT NULL,
    `id_tarefa` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manutencoes_corretivas` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `previsao_termino` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_termino` DATETIME(3) NULL,
    `id_manutencao` VARCHAR(191) NOT NULL,
    `id_item` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `fileFormat` VARCHAR(191) NOT NULL,
    `previsao_termino` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_termino` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos_evaporadoras` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `id_doc` VARCHAR(191) NOT NULL,
    `id_evaporadora` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos_condensadoras` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `id_doc` VARCHAR(191) NOT NULL,
    `id_condensadora` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos_manutencoes` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `id_doc` VARCHAR(191) NOT NULL,
    `id_manutencao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `nivel` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tarefas` ADD CONSTRAINT `tarefas_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `itens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salas` ADD CONSTRAINT `salas_id_setor_fkey` FOREIGN KEY (`id_setor`) REFERENCES `setores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `evaporadoras` ADD CONSTRAINT `evaporadoras_id_sala_fkey` FOREIGN KEY (`id_sala`) REFERENCES `salas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipamentos` ADD CONSTRAINT `equipamentos_id_condensadora_fkey` FOREIGN KEY (`id_condensadora`) REFERENCES `condensadoras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipamentos` ADD CONSTRAINT `equipamentos_id_evaporadora_fkey` FOREIGN KEY (`id_evaporadora`) REFERENCES `evaporadoras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes` ADD CONSTRAINT `manutencoes_id_condensadora_fkey` FOREIGN KEY (`id_condensadora`) REFERENCES `condensadoras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes` ADD CONSTRAINT `manutencoes_id_evaporadora_fkey` FOREIGN KEY (`id_evaporadora`) REFERENCES `evaporadoras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes_preventivas` ADD CONSTRAINT `manutencoes_preventivas_id_manutencao_fkey` FOREIGN KEY (`id_manutencao`) REFERENCES `manutencoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes_preventivas` ADD CONSTRAINT `manutencoes_preventivas_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `itens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes_preventivas` ADD CONSTRAINT `manutencoes_preventivas_id_tarefa_fkey` FOREIGN KEY (`id_tarefa`) REFERENCES `tarefas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes_corretivas` ADD CONSTRAINT `manutencoes_corretivas_id_manutencao_fkey` FOREIGN KEY (`id_manutencao`) REFERENCES `manutencoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `manutencoes_corretivas` ADD CONSTRAINT `manutencoes_corretivas_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `itens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_evaporadoras` ADD CONSTRAINT `documentos_evaporadoras_id_doc_fkey` FOREIGN KEY (`id_doc`) REFERENCES `documentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_evaporadoras` ADD CONSTRAINT `documentos_evaporadoras_id_evaporadora_fkey` FOREIGN KEY (`id_evaporadora`) REFERENCES `evaporadoras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_condensadoras` ADD CONSTRAINT `documentos_condensadoras_id_doc_fkey` FOREIGN KEY (`id_doc`) REFERENCES `documentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_condensadoras` ADD CONSTRAINT `documentos_condensadoras_id_condensadora_fkey` FOREIGN KEY (`id_condensadora`) REFERENCES `evaporadoras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_manutencoes` ADD CONSTRAINT `documentos_manutencoes_id_doc_fkey` FOREIGN KEY (`id_doc`) REFERENCES `documentos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos_manutencoes` ADD CONSTRAINT `documentos_manutencoes_id_manutencao_fkey` FOREIGN KEY (`id_manutencao`) REFERENCES `manutencoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
