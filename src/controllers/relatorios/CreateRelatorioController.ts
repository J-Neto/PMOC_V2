import { Request, Response } from "express";
import { PrismaRelatoriosRepository } from "../../repositories/prisma/relatorios/prisma-relatorios-repository";
import { CreateRelatorioService } from "../../services/relatorios/CreateRelatorioService";

class CreateRelatorioController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { id_entidade, acao, comentario } = req.body;

    // Repositório do modelo do Prisma
    const prismaRelatoriosRepository = new PrismaRelatoriosRepository();

    // Service 
    const createRelatorioService = new CreateRelatorioService(prismaRelatoriosRepository);

    // Executando o service
    const relatorio = await createRelatorioService.execute({
      id_entidade, 
      acao, 
      comentario
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(relatorio instanceof Error) {
      return res.status(400).send(relatorio.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Relatorio criado com sucesso!",
      }
    );
  }
}

export { CreateRelatorioController };