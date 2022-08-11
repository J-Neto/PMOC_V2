export type condensadora_status = "normal" | "defeito" | "parado"

export interface CondensadoraCreateData {
    codigo: string;
    modelo?: string;
    status: condensadora_status;
    status_anterior?: condensadora_status;
    modulo?: string;
    quadro?: string;
    local_instalacao?: string;
}

export interface CondensadoraFind {
    id: string;
}

export interface CondensadoraFindByCodigo {
    codigo: string;
}

export interface CondensadoraDelete {
    id: string;
}

export interface CondensadoraUpdate {
    id: string;
    codigo?: string;
    modelo?: string;
    status?: condensadora_status;
    status_anterior?: condensadora_status;
    modulo?: string;
    quadro?: string;
    local_instalacao?: string;
}

export interface CondensadorasRepository {
    create: (data: CondensadoraCreateData) => Promise<Object | null>;
    get: () => Promise<Object>;
    find: (data: CondensadoraFind) => Promise<Object | null>;
    findByCodigo: (data: CondensadoraFindByCodigo) => Promise<Object | null>;
    delete: (data: CondensadoraDelete) => Promise<void>;
    update: (data: CondensadoraUpdate) => Promise<Object | null>;
}