import { UsuariosRepository, usuario_nivel } from "../../repositories/interfaces/usuarios/usuarios-repository";
import { hash } from "bcryptjs";

// Interface
interface DeleteUsuarioRequest {
  id: string;
}

// Service
export class DeleteUsuarioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private UsuariosRepository: UsuariosRepository,
  ) {}

  // Executando o service
  async execute(request: DeleteUsuarioRequest) {
    
    // Dados do service
    const { id } = request;

    const usuario = await this.UsuariosRepository.find({ id });

    // Verificando se o email já foi cadastrado
    if (!usuario) {
      return new Error("Usuário inexistente!")
    }

    // Deletando ...
    return await this.UsuariosRepository.delete({
      id
    })
  }
}