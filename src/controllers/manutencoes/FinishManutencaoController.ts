import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { FinishManutencaoService } from "../../services/manutencoes/FinishManutencaoService";
import { PrismaRelatoriosRepository } from "../../repositories/prisma/relatorios/prisma-relatorios-repository";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { PrismaManutencoesCorretivasRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-corretivas-repository";
import { PrismaManutencoesPreventivasRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-preventivas-repository";

class FinishManutencaoController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;
    const { finalizado } = req.body;

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();
    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();
    const prismaEvaporadorasRepository = new PrismaEvaporadorasRepository();
    const prismaManutencoesCorretivasRepository = new PrismaManutencoesCorretivasRepository();
    const prismaManutencoesPreventivasRepository = new PrismaManutencoesPreventivasRepository();
    
    // Service 
    const finishManutencaoService = new FinishManutencaoService(prismaManutencoesRepository, prismaCondensadorasRepository, prismaEvaporadorasRepository, prismaManutencoesCorretivasRepository, prismaManutencoesPreventivasRepository);

    // Executando o service
    const manutencao = await finishManutencaoService.execute({ id, finalizado });

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencao instanceof Error) {
      return res.status(400).send(manutencao.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Manutenção finalizada com sucesso!",
      }
    );
  }
}

export { FinishManutencaoController };