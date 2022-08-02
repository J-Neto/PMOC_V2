export interface DocumentoEvaporadoraCreateData {
    id_doc: string;
    id_evaporadora: string;
}

export interface DocumentoEvaporadoraFind {
    id: string;
}

export interface DocumentoEvaporadoraDelete {
    id: string;
}

export interface DocumentoEvaporadorasRepository {
    create: (data: DocumentoEvaporadoraCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: DocumentoEvaporadoraFind) => Promise<Object | null>;
    delete: (data: DocumentoEvaporadoraDelete) => Promise<void>;
}