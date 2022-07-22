import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { FindItemService } from "../../services/itens/FindItemService";

class FindItemController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaItensRepository = new PrismaItensRepository();

    // Service
    const findItemService = new FindItemService(prismaItensRepository);

    // Executando o service
    const item = await findItemService.execute({
      id, 
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(item instanceof Error) {
      return res.status(400).send(item.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        item,
      }
    );
  }
}

export { FindItemController };