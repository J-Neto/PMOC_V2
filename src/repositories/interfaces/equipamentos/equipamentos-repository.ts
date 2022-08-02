export type equipamento_status = "normal" | "defeito" | "parado"
export type equipamento_tipo = "SPLIT" | "VRF"

export interface EquipamentoCreateData {
    tipo: equipamento_tipo;
    linha?: string;
    codigo: string;
    status: equipamento_status;
    id_condensadora: string;
    id_evaporadora: string;
}

export interface EquipamentoFind {
    id: string;
}

export interface EquipamentoFindByCondensadora {
    id_condensadora: string;
}

export interface EquipamentoFind_SPLIT_ByCondensadora {
    id_condensadora: string;
}

export interface EquipamentoFindByEvaporadora {
    id_evaporadora: string;
}

export interface EquipamentoDelete {
    id: string;
}

export interface EquipamentoUpdate {
    id: string;
    tipo?: equipamento_tipo;
    linha?: string;
    codigo?: string;
    status?: equipamento_status;
    id_condensadora?: string;
    id_evaporadora?: string;
}

export interface EquipamentosRepository {
    create: (data: EquipamentoCreateData) => Promise<Object | null>;
    get: () => Promise<Object>;
    find: (data: EquipamentoFind) => Promise<Object | null>;
    findByCondensadora: (data: EquipamentoFindByCondensadora) => Promise<Object | null>;
    findSPLITByCondensadora: (data: EquipamentoFind_SPLIT_ByCondensadora) => Promise<Object | null>;
    findByEvaporadora: (data: EquipamentoFindByEvaporadora) => Promise<Object | null>;
    delete: (data: EquipamentoDelete) => Promise<void>;
    update: (data: EquipamentoUpdate) => Promise<void>;
}