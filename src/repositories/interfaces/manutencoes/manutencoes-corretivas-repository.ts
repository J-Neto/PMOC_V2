export interface ManutencaoCorretivaCreateData {
    descricao: string;
    previsao_termino?: Date;
    data_termino?: Date;
    id_manutencao: string;
    id_item: string;
}

export interface ManutencaoCorretivaFind {
    id: string;
}

export interface ManutencaoCorretivaFindByManutencao {
    id_manu: string;
}

export interface ManutencaoCorretivaDelete {
    id: string;
}

export interface ManutencaoCorretivaUpdate {
    id: string;
    descricao?: string;
    previsao_termino?: Date;
    data_termino?: Date;
    id_manutencao?: string;
    id_item?: string;
}

export interface ManutencoesCorretivasRepository {
    create: (data: ManutencaoCorretivaCreateData) => Promise<Object | null>;
    get: () => Promise<Object>;
    find: (data: ManutencaoCorretivaFind) => Promise<Object | null>;
    findByManutencao: (data: ManutencaoCorretivaFindByManutencao) => Promise<Object | null>;
    delete: (data: ManutencaoCorretivaDelete) => Promise<void>;
    update: (data: ManutencaoCorretivaUpdate) => Promise<void>;
}