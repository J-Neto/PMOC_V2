import { UsuariosRepository, usuario_nivel } from "../../repositories/interfaces/usuarios/usuarios-repository";
import { hash } from "bcryptjs";

// Service
export class GetUsuariosService {
  
  // Recebendo o repositório no construtor
  constructor(
    private usuariosRepository: UsuariosRepository,
  ) {}

  // Executando o service
  async execute() {
    
    // Buscando todos os usuarios cadastrados no banco de dados
    const usuarios = await this.usuariosRepository.get();

    // Verificando se o email já foi cadastrado
    if (Object.keys(usuarios).length == 0) {
      return new Error("Sem usuários cadastrados!")
    }

    return usuarios;
  }
}