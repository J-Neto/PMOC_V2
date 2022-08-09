import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { PauseManutencaoService } from "../../services/manutencoes/PauseManutencaoService";
import { PrismaRelatoriosRepository } from "../../repositories/prisma/relatorios/prisma-relatorios-repository";

class PauseManutencaoController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;
    const { pause, comentario } = req.body;

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();
    const prismaRelatoriosRepository = new PrismaRelatoriosRepository();
    
    // Service 
    const pauseManutencaoService = new PauseManutencaoService(prismaManutencoesRepository, prismaRelatoriosRepository);

    // Executando o service
    const manutencao = await pauseManutencaoService.execute({ id, pause, comentario });

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencao instanceof Error) {
      return res.status(400).send(manutencao.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Manutenção interrompida com sucesso!",
      }
    );
  }
}

export { PauseManutencaoController };