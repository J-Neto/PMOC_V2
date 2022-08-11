import { UsuariosRepository, usuario_nivel } from "../../repositories/interfaces/usuarios/usuarios-repository";
import { hash } from "bcryptjs";

// Interface
interface CreateUsuarioRequest {
  nome: string;
  email: string;
  nivel: usuario_nivel;
  senha: string;
}

// Service
export class CreateUsuarioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private UsuariosRepository: UsuariosRepository,
  ) {}

  // Executando o service
  async execute(request: CreateUsuarioRequest) {
    
    // Dados do service
    const { nome, email, nivel, senha } = request;

    // Verificando se o email já foi cadastrado
    if (await this.UsuariosRepository.findByEmail({ email })) {
      return new Error("Email já cadastrado!")
    }

    // Criptografando a senha
    const passwordHash = await hash(senha, 8);

    // Criando ...
    return await this.UsuariosRepository.create({
      nome, 
      email,
      nivel,
      senha: passwordHash
    })
  }
}