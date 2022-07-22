import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { CreateItemService } from "../../services/itens/CreateItemService";

class CreateItemController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { nome } = req.body;

    // Repositório do modelo tag do Prisma
    const prismaItensRepository = new PrismaItensRepository();

    // Service da tag
    const createItemService = new CreateItemService(prismaItensRepository);

    // Executando o service
    const tag = await createItemService.execute({
      nome,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(tag instanceof Error) {
      return res.status(400).send(tag.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Item criado com sucesso!",
      }
    );
  }
}

export { CreateItemController };