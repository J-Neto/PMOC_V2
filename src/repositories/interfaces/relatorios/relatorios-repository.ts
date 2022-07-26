export interface RelatorioCreateData {
    id_entidade: string;
    acao: string;
    comentario?: string;
}

export interface RelatorioFind {
    id: string;
}

export interface RelatorioDelete {
    id: string;
}

export interface RelatorioUpdate {
    id: string;
    id_entidade?: string;
    acao?: string;
    comentario?: string;
}

export interface RelatoriosRepository {
    create: (data: RelatorioCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: RelatorioFind) => Promise<Object | null>;
    delete: (data: RelatorioDelete) => Promise<void>;
    update: (data: RelatorioUpdate) => Promise<void>;
}