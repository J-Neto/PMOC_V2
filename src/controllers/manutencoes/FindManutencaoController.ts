import { Request, Response } from "express";
import { PrismaManutencoesRepository } from "../../repositories/prisma/manutencoes/prisma-manutencoes-repository";
import { FindManutencaoService } from "../../services/manutencoes/FindManutencaoService";

class FindManutencaoController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaManutencoesRepository = new PrismaManutencoesRepository();
    
    // Service 
    const findManutencoesService = new FindManutencaoService(prismaManutencoesRepository);

    // Executando o service
    const manutencao = await findManutencoesService.execute({ id });

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(manutencao instanceof Error) {
      return res.status(400).send(manutencao.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send({
      manutencao
    });
  }
}

export { FindManutencaoController };