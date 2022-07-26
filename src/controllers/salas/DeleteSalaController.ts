import { Request, Response } from "express";
import { PrismaSalasRepository } from "../../repositories/prisma/salas/prisma-salas-repository";
import { DeleteSalaService } from "../../services/salas/DeleteSalaService";

class DeleteSalaController {
  async handle(req:Request, res:Response) {

    // Dados do parâmetro da requição
    const { id } = req.params;

    // Repositório do modelo do Prisma
    const prismaSalasRepository = new PrismaSalasRepository();

    // Service
    const deleteSalaService = new DeleteSalaService(prismaSalasRepository);

    // Executando o service
    const sala = await deleteSalaService.execute({
      id,
    })

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(sala instanceof Error) {
      return res.status(400).send(sala.message);
    } 

    // Retornando status para o usuário
    return res.status(204).end();
  }
}

export { DeleteSalaController };