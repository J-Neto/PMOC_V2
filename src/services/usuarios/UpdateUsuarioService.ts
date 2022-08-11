import { UsuariosRepository, usuario_nivel } from "../../repositories/interfaces/usuarios/usuarios-repository";
import { hash } from "bcryptjs";

// Interface
interface UpdateUsuarioRequest {
  id: string;
  nome?: string;
  email?: string;
  nivel?: usuario_nivel;
  senha?: string;
}

// Service
export class UpdateUsuarioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private usuariosRepository: UsuariosRepository,
  ) {}

  // Executando o service
  async execute(request: UpdateUsuarioRequest) {
    
    // Dados do service
    const { id, nome, email, nivel, senha } = request;

    const usuario = await this.usuariosRepository.find({ id })

    // Verificando se o email já foi cadastrado
    if (!usuario) {
      return new Error("Usuário inexistente!")
    }

    let passwordHash = Object(usuario).senha;

    if (senha) {
      // Criptografando a senha
      passwordHash = await hash(senha, 8);
    }

    // Criando ...
    return await this.usuariosRepository.update({
      id,
      nome, 
      email,
      nivel,
      senha: passwordHash
    })
  }
}