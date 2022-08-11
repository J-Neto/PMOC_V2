import { Request, Response } from "express";
import { PrismaUsuariosRepository } from "../../repositories/prisma/usuarios/prisma-usuarios-repository";
import { AuthenticateUsuarioService } from "../../services/usuarios/AuthenticateUsuarioService";

class AuthenticateUsuarioController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { email, senha } = req.body;

    // Repositório do modelo do Prisma
    const prismaUsuariosRepository = new PrismaUsuariosRepository();

    // Service 
    const authenticateUsuarioService = new AuthenticateUsuarioService(prismaUsuariosRepository);

    // Executando o service
    const token = await authenticateUsuarioService.execute({
      email, 
      senha
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(token instanceof Error) {
      return res.status(400).send(token.message);
    }

    // Retornando token para o usuário
    return res.status(200).send(token);
  }
}

export { AuthenticateUsuarioController };