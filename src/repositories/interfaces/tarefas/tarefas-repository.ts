export type tarefa_type = "SPLIT" | "VRF";
export type tarefa_frequencia = "mensal" | "trimestral" | "semestral" | "anual";

export interface TarefaCreateData {
    tipo: tarefa_type;
    id_item: string;
    descricao: string;
    frequencia: tarefa_frequencia;
}

export interface TarefaFind {
    id: string;
}

export interface TarefaGetByItem {
    id_item: string;
}

export interface TarefaDelete {
    id: string;
}

export interface TarefaUpdate {
    id: string;
    tipo?: tarefa_type;
    id_item?: string;
    descricao?: string;
    frequencia?: tarefa_frequencia;
}

export interface TarefasRepository {
    create: (data: TarefaCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: TarefaFind) => Promise<Object | null>;
    getByItem: (data: TarefaGetByItem) => Promise<Object>;
    delete: (data: TarefaDelete) => Promise<void>;
    update: (data: TarefaUpdate) => Promise<void>;
}