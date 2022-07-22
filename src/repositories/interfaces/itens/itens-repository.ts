export interface ItemCreateData {
    nome: string;
}

export interface ItemFind {
    id: string;
}

export interface ItemDelete {
    id: string;
}

export interface ItemUpdate {
    id: string;
    nome?: string;
}

export interface ItensRepository {
    create: (data: ItemCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: ItemFind) => Promise<Object | null>;
    delete: (data: ItemDelete) => Promise<void>;
    update: (data: ItemUpdate) => Promise<void>;
}