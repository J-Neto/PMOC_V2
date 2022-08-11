import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { PrismaManutencoesCorretivasRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-corretivas-repository";
import { PrismaManutencoesPreventivasRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-preventivas-repository";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { GetManutencoesService } from "../../services/manutencoes/GetManutencoesService";

class GetManutencoesController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();

    // Service 
    const getManutencoesService = new GetManutencoesService(prismaManutencoesRepository);

    // Executando o service
    const manutencoes = await getManutencoesService.execute();

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencoes instanceof Error) {
      return res.status(400).send(manutencoes.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(manutencoes);
  }
}

export { GetManutencoesController };