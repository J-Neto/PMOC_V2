export type evaporadora_status = "normal" | "defeito" | "parado"

export interface EvaporadoraCreateData {
    codigo: string;
    modelo?: string;
    marca?: string;
    potencia: number;
    status: evaporadora_status;
    status_anterior?: evaporadora_status;
    quadro?: string;
    id_sala?: string;
}

export interface EvaporadoraFind {
    id: string;
}

export interface EvaporadoraFindByCodigo {
    codigo: string;
}

export interface EvaporadoraDelete {
    id: string;
}

export interface EvaporadoraUpdate {
    id: string;
    codigo?: string;
    modelo?: string;
    marca?: string;
    potencia?: number;
    status?: evaporadora_status;
    status_anterior?: evaporadora_status;
    quadro?: string;
    id_sala?: string;
}

export interface EvaporadorasRepository {
    create: (data: EvaporadoraCreateData) => Promise<Object | null>;
    get: () => Promise<Object>;
    find: (data: EvaporadoraFind) => Promise<Object | null>;
    findByCodigo: (data: EvaporadoraFindByCodigo) => Promise<Object | null>;
    delete: (data: EvaporadoraDelete) => Promise<void>;
    update: (data: EvaporadoraUpdate) => Promise<Object | null>;
}