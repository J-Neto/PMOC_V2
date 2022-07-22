import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { UpdateItemService } from "../../services/itens/UpdateItemService";

class UpdateItemController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Dados do corpo da requisição
    const { nome } = req.body;

    // Repositório do modelo do Prisma
    const prismaItensRepository = new PrismaItensRepository();

    // Service
    const updateItemService = new UpdateItemService(prismaItensRepository);

    // Executando o service
    const item = await updateItemService.execute({
      id, 
      nome,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(item instanceof Error) {
      return res.status(400).send(item.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Item atualizado com sucesso!",
      }
    );
  }
}

export { UpdateItemController };