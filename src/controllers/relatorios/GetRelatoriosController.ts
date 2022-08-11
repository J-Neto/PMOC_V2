import { Request, Response } from "express";
import { PrismaRelatoriosRepository } from "../../repositories/prisma/relatorios/prisma-relatorios-repository";
import { GetRelatoriosService } from "../../services/relatorios/GetRelatoriosService";

class GetRelatoriosController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaRelatoriosRepository = new PrismaRelatoriosRepository();

    // Service 
    const getRelatoriosService = new GetRelatoriosService(prismaRelatoriosRepository);

    // Executando o service
    const relatorios = await getRelatoriosService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(relatorios instanceof Error) {
      return res.status(400).send(relatorios.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(relatorios);
  }
}

export { GetRelatoriosController };