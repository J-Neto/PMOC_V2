export interface SetorCreateData {
    nome: string;
}

export interface SetorFind {
    id: string;
}

export interface SetorDelete {
    id: string;
}

export interface SetorUpdate {
    id: string;
    nome?: string;
}

export interface SetoresRepository {
    create: (data: SetorCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: SetorFind) => Promise<Object | null>;
    delete: (data: SetorDelete) => Promise<void>;
    update: (data: SetorUpdate) => Promise<void>;
}