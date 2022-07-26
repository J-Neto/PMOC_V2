export type tarefa_type = "SPLIT" | "VRF";
export type tarefa_frequencia = "mensal" | "trimestral" | "semestral" | "anual";

export interface SalaCreateData {
    nome: string;
    andar: string;
    dimensao?: string;
    id_setor?: string;
}

export interface SalaFind {
    id: string;
}

export interface SalaDelete {
    id: string;
}

export interface SalaUpdate {
    id: string;
    nome?: string;
    andar?: string;
    dimensao?: string;
    id_setor?: string;
}

export interface SalasRepository {
    create: (data: SalaCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: SalaFind) => Promise<Object | null>;
    delete: (data: SalaDelete) => Promise<void>;
    update: (data: SalaUpdate) => Promise<void>;
}