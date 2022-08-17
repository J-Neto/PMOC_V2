export interface ManutencaoPreventivaCreateData {
    previsao_termino?: Date;
    data_termino?: Date;
    data_agendado?: Date;
    id_manutencao: string;
    id_item: string;
    id_tarefa: string;
}

export interface ManutencaoPreventivaFind {
    id: string;
}

export interface ManutencaoPreventivaFindByManutencao {
    id_manu: string;
}

export interface ManutencaoPreventivaDelete {
    id: string;
}

export interface ManutencaoPreventivaUpdate {
    id: string;
    previsao_termino?: Date;
    data_termino?: Date;
    data_agendado?: Date;
    id_manutencao?: string;
    id_item?: string;
    id_tarefa?: string;
}

export interface ManutencoesPreventivasRepository {
    create: (data: ManutencaoPreventivaCreateData) => Promise<Object | null>;
    get: () => Promise<Object>;
    find: (data: ManutencaoPreventivaFind) => Promise<Object | null>;
    findByManutencao: (data: ManutencaoPreventivaFindByManutencao) => Promise<Object | null>;
    delete: (data: ManutencaoPreventivaDelete) => Promise<void>;
    update: (data: ManutencaoPreventivaUpdate) => Promise<Object | null>;
}