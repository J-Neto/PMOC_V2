import { Request, Response } from "express";
import { PrismaSalasRepository } from "../../repositories/prisma/salas/prisma-salas-repository";
import { FindSalaService } from "../../services/salas/FindSalaService";

class FindSalaController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaSalasRepository = new PrismaSalasRepository();

    // Service
    const findSalaService = new FindSalaService(prismaSalasRepository);

    // Executando o service
    const sala = await findSalaService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(sala instanceof Error) {
      return res.status(400).send(sala.message);
    } 

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        sala,
      }
    );
  }
}

export { FindSalaController };