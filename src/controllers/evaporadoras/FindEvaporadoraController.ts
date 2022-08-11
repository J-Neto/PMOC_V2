import { Request, Response } from "express";
import { PrismaEvaporadorasRepository } from "../../repositories/prisma/evaporadoras/prisma-evaporadoras-repository";
import { FindEvaporadoraService } from "../../services/evaporadoras/FindEvaporadoraService";

class FindEvaporadoraController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requisição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaEvaporadorasRepository = new PrismaEvaporadorasRepository();

    // Service 
    const findEvaporadoraService = new FindEvaporadoraService(prismaEvaporadorasRepository);

    // Executando o service
    const evaporadora = await findEvaporadoraService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(evaporadora instanceof Error) {
      return res.status(400).send(evaporadora.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(evaporadora);
  }
}

export { FindEvaporadoraController };