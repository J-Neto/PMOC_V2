import { Request, Response } from "express";
import { PrismaSetoresRepository } from "../../repositories/prisma/setores/prisma-setores-repository";
import { GetSetoresService } from "../../services/setores/GetSetoresService";

class GetSetoresController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaSetoresRepository = new PrismaSetoresRepository();

    // Service
    const getSetoresService = new GetSetoresService(prismaSetoresRepository);

    // Executando o service
    const setores = await getSetoresService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(setores instanceof Error) {
      return res.status(400).send(setores.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        setores,
      }
    );
  }
}

export { GetSetoresController };