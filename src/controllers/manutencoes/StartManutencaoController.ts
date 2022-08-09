import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { PrismaCondensadorasRepository } from "../../repositories/prisma/condensadoras/prisma-condensadoras-repository";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { StartManutencaoService } from "../../services/manutencoes/StartManutencaoService";
import { PrismaRelatoriosRepository } from "../../repositories/prisma/relatorios/prisma-relatorios-repository";

class StartManutencaoController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;
    const { iniciar } = req.body;

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();
    const prismaRelatoriosRepository = new PrismaRelatoriosRepository();
    
    // Service 
    const startManutencaoService = new StartManutencaoService(prismaManutencoesRepository, prismaRelatoriosRepository);

    // Executando o service
    const manutencao = await startManutencaoService.execute({ id, iniciar });

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencao instanceof Error) {
      return res.status(400).send(manutencao.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        message:"Manutenção iniciada com sucesso!",
      }
    );
  }
}

export { StartManutencaoController };