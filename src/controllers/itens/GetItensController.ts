import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { GetItensService } from "../../services/itens/GetItensService";

class GetItensController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaItensRepository = new PrismaItensRepository();

    // Service
    const getItensService = new GetItensService(prismaItensRepository);

    // Executando o service
    const itens = await getItensService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(itens instanceof Error) {
      return res.status(400).send(itens.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(itens);
  }
}

export { GetItensController };