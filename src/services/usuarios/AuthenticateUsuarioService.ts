import { UsuariosRepository, usuario_nivel } from "../../repositories/interfaces/usuarios/usuarios-repository";
import { hash } from "bcryptjs";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

// Interface
interface AuthenticateUsuarioRequest {
  email: string;
  senha: string;
}

// Service
export class AuthenticateUsuarioService {
  
  // Recebendo o repositório no construtor
  constructor(
    private UsuariosRepository: UsuariosRepository,
  ) {}

  // Executando o service
  async execute(request: AuthenticateUsuarioRequest) {
    
    // Dados do service
    const { email, senha } = request;

    // Verificando se o email já foi cadastrado
    const usuario = await this.UsuariosRepository.findByEmail({ email })
    if (!usuario) {
      return new Error("Email/Senha incorreta!");
    }

    // verificar se está correta
    const passwordMatch = await compare(senha, Object(usuario).senha);

    if (!passwordMatch) {
      return new Error("Email/Senha incorreta!");
    }

    // Gerar token
    const token = sign({
      email: Object(usuario).email
    }, "4f93ac9d10cb751b8c9c646bc9dbccb9", {
      subject: Object(usuario).id,
      expiresIn: "1d"
    });

    // Retornando ...
    return {
      name: Object(usuario).nome,
      token: token,
      nivel: Object(usuario).nivel
  }
  }
}