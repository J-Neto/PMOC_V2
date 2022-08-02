import { Request, Response } from "express";
import { PrismaEquipamentosRepository } from "../../repositories/prisma/equipamentos/prisma-equipamentos-repository";
import { GetEquipamentosService } from "../../services/equipamentos/GetEquipamentosService";

class GetEquipamentosController {
  async handle(req:Request, res:Response) {

    // Repositório do modelo do Prisma
    const prismaEquipamentosRepository = new PrismaEquipamentosRepository();

    // Service 
    const getEquipamentosService = new GetEquipamentosService(prismaEquipamentosRepository);

    // Executando o service
    const equipamentos = await getEquipamentosService.execute()

    // Caso aconteça algum erro, interrompe o processo retorna a mensagem de erro
    if(equipamentos instanceof Error) {
      return res.status(400).send(equipamentos.message);
    }

    // Retornando mensagem de sucesso para o usuário
    return res.status(201).send(
      {
        equipamentos,
      }
    );
  }
}

export { GetEquipamentosController };