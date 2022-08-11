import { Request, Response } from "express";
import { PrismaSalasRepository } from "../../repositories/prisma/salas/prisma-salas-repository";
import { GetSalasService } from "../../services/salas/GetSalasService";

class GetSalasController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaSalasRepository = new PrismaSalasRepository();

    // Service
    const getSalasService = new GetSalasService(prismaSalasRepository);

    // Executando o service
    const salas = await getSalasService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(salas instanceof Error) {
      return res.status(400).send(salas.message);
    } 

    // Retornando mensagem de sucesso para o usuário
    return res.status(200).send(salas);
  }
}

export { GetSalasController };