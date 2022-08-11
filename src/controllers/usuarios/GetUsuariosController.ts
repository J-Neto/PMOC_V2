import { Request, Response } from "express";
import { PrismaUsuariosRepository } from "../../repositories/prisma/usuarios/prisma-usuarios-repository";
import { GetUsuariosService } from "../../services/usuarios/GetUsuariosService";

class GetUsuariosController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaUsuariosRepository = new PrismaUsuariosRepository();

    // Service 
    const getUsuariosService = new GetUsuariosService(prismaUsuariosRepository);

    // Executando o service
    const usuarios = await getUsuariosService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(usuarios instanceof Error) {
      return res.status(400).send(usuarios.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(usuarios);
  }
}

export { GetUsuariosController };