import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { DeleteItemService } from "../../services/itens/DeleteItemService";

class DeleteItemController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaItensRepository = new PrismaItensRepository();

    // Service
    const deleteItemService = new DeleteItemService(prismaItensRepository);

    // Executando o service
    const item = await deleteItemService.execute({
      id, 
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(item instanceof Error) {
      return res.status(400).send(item.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(204).end();
  }
}

export { DeleteItemController };