import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { PrismaTarefasRepository } from "../../repositories/prisma/tarefas/prisma-tarefas-repository";
import { DeleteTarefaService } from "../../services/tarefas/DeleteTarefaService";

class DeleteTarefaController {
  async handle(req:Request, res:Response) {

    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaTarefasRepository = new PrismaTarefasRepository();

    // Service
    const deleteTarefaService = new DeleteTarefaService(prismaTarefasRepository);

    // Executando o service
    const tarefa = await deleteTarefaService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(tarefa instanceof Error) {
      return res.status(400).send(tarefa.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(204).end();
  }
}

export { DeleteTarefaController };