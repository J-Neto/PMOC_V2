import { Request, Response } from "express";
import { PrismaUsuariosRepository } from "../../repositories/prisma/usuarios/prisma-usuarios-repository";
import { DeleteUsuarioService } from "../../services/usuarios/DeleteUsuarioService";

class DeleteUsuarioController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaUsuariosRepository = new PrismaUsuariosRepository();

    // Service 
    const deleteUsuarioService = new DeleteUsuarioService(prismaUsuariosRepository);

    // Executando o service
    const usuario = await deleteUsuarioService.execute({
      id
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(usuario instanceof Error) {
      return res.status(400).send(usuario.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(204).end();
  }
}

export { DeleteUsuarioController };