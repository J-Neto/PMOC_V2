import { Request, Response } from "express";
import { PrismaItensRepository } from "../../repositories/prisma/itens/prisma-itens-repository";
import { PrismaTarefasRepository } from "../../repositories/prisma/tarefas/prisma-tarefas-repository";
import { CreateTarefaService } from "../../services/tarefas/CreateTarefaService";

class CreateTarefaController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { tipo, id_item, descricao, frequencia } = req.body;

    // Repositório do modelo do Prisma
    const prismaTarefasRepository = new PrismaTarefasRepository();
    const prismaItensRepository = new PrismaItensRepository();

    // Service
    const createTarefaService = new CreateTarefaService(prismaTarefasRepository, prismaItensRepository);

    // Executando o service
    const tarefa = await createTarefaService.execute({
      tipo, 
      id_item, 
      descricao, 
      frequencia,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(tarefa instanceof Error) {
      return res.status(400).send(tarefa.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Tarefa criada com sucesso!",
      }
    );
  }
}

export { CreateTarefaController };