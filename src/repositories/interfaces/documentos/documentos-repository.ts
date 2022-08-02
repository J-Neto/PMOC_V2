export interface DocumentoCreateData {
    path: string;
    filename: string;
    originalName: string;
    fileFormat: string;
}

export interface DocumentoFind {
    id: string;
}

export interface DocumentoDelete {
    id: string;
}

export interface DocumentosRepository {
    create: (data: DocumentoCreateData) => Promise<Object | null>;
    get: () => Promise<Object>;
    find: (data: DocumentoFind) => Promise<Object | null>;
    delete: (data: DocumentoDelete) => Promise<void>;
}