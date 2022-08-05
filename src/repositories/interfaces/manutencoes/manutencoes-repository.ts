export type manutencao_tipo = "preventiva" | "corretiva"
export type manutencao_status = "executar" | "atrasado" | "realizado" | "execucao" | "espera" | "agendado"

export interface ManutencaoCreateData {
    tipo: manutencao_tipo;
    status: manutencao_status;
    comentario?: string;
    tec_responsavel: string;
    custo?: number;
    agendado?: boolean;
    foto?: string;
    previsao_termino?: Date;
    data_termino?: Date;
    data_agendado?: Date;
    id_condensadora?: string;
    id_evaporadora?: string;
}

export interface ManutencaoFind {
    id: string;
}

export interface ManutencaoFindByCondensadora {
    id_condensadora: string;
}

export interface ManutencaoFindByEvaporadora {
    id_evaporadora: string;
}

export interface ManutencaoDelete {
    id: string;
}

export interface ManutencaoUpdate {
    id: string;
    tipo?: manutencao_tipo;
    status?: manutencao_status;
    comentario?: string;
    tec_responsavel?: string;
    custo?: number;
    agendado?: boolean;
    foto?: string;
    previsao_termino?: Date;
    data_termino?: Date;
    data_agendado?: Date;
    id_condensadora?: string;
    id_evaporadora?: string;
}

export interface ManutencoesRepository {
    create: (data: ManutencaoCreateData) => Promise<Object | null>;
    get: () => Promise<Object>;
    find: (data: ManutencaoFind) => Promise<Object | null>;
    findByCondensadora: (data: ManutencaoFindByCondensadora) => Promise<Object | null>;
    findByEvaporadora: (data: ManutencaoFindByEvaporadora) => Promise<Object | null>;
    delete: (data: ManutencaoDelete) => Promise<void>;
    update: (data: ManutencaoUpdate) => Promise<void>;
}