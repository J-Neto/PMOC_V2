import { Request, Response } from "express";
import { PrismaTarefasRepository } from "../../repositories/prisma/tarefas/prisma-tarefas-repository";
import { FindTarefaService } from "../../services/tarefas/FindTarefaService";

class FindTarefaController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaTarefasRepository = new PrismaTarefasRepository();

    // Service
    const findTarefaService = new FindTarefaService(prismaTarefasRepository);

    // Executando o service
    const tarefa = await findTarefaService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(tarefa instanceof Error) {
      return res.status(400).send(tarefa.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(tarefa);
  }
}

export { FindTarefaController };