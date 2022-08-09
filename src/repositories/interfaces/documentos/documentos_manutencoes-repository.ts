export interface DocumentoManutencaoCreateData {
    id_doc: string;
    id_manutencao: string;
}

export interface DocumentoManutencaoFind {
    id: string;
}

export interface DocumentoManutencaoDelete {
    id: string;
}

export interface DocumentoManutencoesRepository {
    create: (data: DocumentoManutencaoCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: DocumentoManutencaoFind) => Promise<Object | null>;
    delete: (data: DocumentoManutencaoDelete) => Promise<void>;
}