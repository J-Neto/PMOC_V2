import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { PrismaTarefasRepository } from "../../repositories/prisma/tarefas/prisma-tarefas-repository";
import { GetTarefasByItemService } from "../../services/tarefas/GetTarefasByItemService";

class GetTarefasByItemController {
  async handle(req:Request, res:Response) {

    const { id_item } = req.params;

    // Repositório do modelo do Prisma
    const prismaTarefasRepository = new PrismaTarefasRepository();
    const prismaItensReposityory = new PrismaItensRepository();

    // Service
    const getTarefasByItemService = new GetTarefasByItemService(prismaTarefasRepository, prismaItensReposityory);

    // Executando o service
    const tarefas = await getTarefasByItemService.execute({
      id_item,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(tarefas instanceof Error) {
      return res.status(400).send(tarefas.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(tarefas);
  }
}

export { GetTarefasByItemController };