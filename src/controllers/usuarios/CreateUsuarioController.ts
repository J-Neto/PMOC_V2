import { Request, Response } from "express";
import { PrismaUsuariosRepository } from "../../repositories/prisma/usuarios/prisma-usuarios-repository";
import { CreateUsuarioService } from "../../services/usuarios/CreateUsuarioService";

class CreateUsuarioController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { nome, email, nivel, senha } = req.body;

    // Repositório do modelo do Prisma
    const prismaUsuariosRepository = new PrismaUsuariosRepository();

    // Service 
    const createUsuarioService = new CreateUsuarioService(prismaUsuariosRepository);

    // Executando o service
    const usuario = await createUsuarioService.execute({
      nome, 
      email, 
      nivel, 
      senha
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(usuario instanceof Error) {
      return res.status(400).send(usuario.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Usuário criado com sucesso!",
      }
    );
  }
}

export { CreateUsuarioController };