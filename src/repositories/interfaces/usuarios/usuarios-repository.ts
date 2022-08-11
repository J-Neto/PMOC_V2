export type usuario_nivel = 1 | 2;

export interface UsuarioCreateData {
    nome: string;
    email: string;
    nivel: usuario_nivel;
    senha: string;
}

export interface UsuarioFind {
    id: string;
}

export interface UsuarioFindByEmail {
    email: string;
}

export interface UsuarioGetByItem {
    id_item: string;
}

export interface UsuarioDelete {
    id: string;
}

export interface UsuarioUpdate {
    id: string;
    nome?: string;
    email?: string;
    nivel?: usuario_nivel;
    senha?: string;
}


export interface UsuariosRepository {
    create: (data: UsuarioCreateData) => Promise<void>;
    get: () => Promise<Object>;
    find: (data: UsuarioFind) => Promise<Object | null>;
    findByEmail: (data: UsuarioFindByEmail) => Promise<Object | null>;
    delete: (data: UsuarioDelete) => Promise<void>;
    update: (data: UsuarioUpdate) => Promise<void>;
}