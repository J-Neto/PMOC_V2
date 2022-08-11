import { Request, Response } from "express";
import { PrismaTarefasRepository } from "../../repositories/prisma/tarefas/prisma-tarefas-repository";
import { GetTarefasService } from "../../services/tarefas/GetTarefasService";

class GetTarefasController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaTarefasRepository = new PrismaTarefasRepository();

    // Service
    const getTarefasService = new GetTarefasService(prismaTarefasRepository);

    // Executando o service
    const tarefas = await getTarefasService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(tarefas instanceof Error) {
      return res.status(400).send(tarefas.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(tarefas);
  }
}

export { GetTarefasController };