export interface DocumentoCondensadoraCreateData {
    id_doc: string;
    id_condensadora: string;
}

export interface DocumentoCondensadoraFind {
    id: string;
}

export interface DocumentoCondensadoraDelete {
    id: string;
}

export interface DocumentoCondensadorasRepository {
    create: (data: DocumentoCondensadoraCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: DocumentoCondensadoraFind) => Promise<Object | null>;
    delete: (data: DocumentoCondensadoraDelete) => Promise<void>;
}