import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { PrismaManutencoesCorretivasRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-corretivas-repository";
import { PrismaManutencoesPreventivasRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-preventivas-repository";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { CreateManutencaoService } from "../../services/manutencoes/CreateManutencaoService";

class CreateManutencaoController {
  async handle(req:Request, res:Response) {

    // Dados do corpo da requisição
    const { tipo, status, tec_responsavel, custo, previsao_termino, id_condensadora, id_evaporadora, item_array, descricao_array, item_preventiva, tarefas_array } = req.body;

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();
    const prismaManutencoesCorretivasRepository = new PrismaManutencoesCorretivasRepository();
    const prismaManutencoesPreventivasRepository = new PrismaManutencoesPreventivasRepository();
    const prismaCondensadorasRepository = new PrismaCondensadorasRepository();
    const prismaEvaporadorasRepository = new PrismaEvaporadorasRepository();

    // Service 
    const createManutencaoService = new CreateManutencaoService(prismaManutencoesRepository, prismaManutencoesCorretivasRepository, prismaManutencoesPreventivasRepository, prismaCondensadorasRepository, prismaEvaporadorasRepository);

    // Executando o service
    const manutencao = await createManutencaoService.execute({
      tipo, 
      status, 
      tec_responsavel, 
      custo, 
      previsao_termino, 
      id_condensadora, 
      id_evaporadora,
      item_array,
      descricao_array,
      item_preventiva,
      tarefas_array
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencao instanceof Error) {
      return res.status(400).send(manutencao.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Manutenção criada com sucesso!",
      }
    );
  }
}

export { CreateManutencaoController };